function getFileExtension(blob) {
    const mimeTypes = {
        'application/pdf': '.pdf',
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/zip': '.zip',
        'application/x-zip-compressed': '.zip',
    };
    return mimeTypes[blob.type] || '.bin';
}

function sanitizeFilename(str) {
    return str.replace(/[<>:"/\\|?*]/g, '_');
}

function scrapeMahasiswaData() {
    const data = {};
    const cards = document.querySelectorAll('.q-card.bodi-content');
    
    if (cards.length >= 2) {
        const mainCard = cards[1];
        const rows = mainCard.querySelectorAll('.row.q-col-gutter-sm');
        
        rows.forEach(row => {
            const cols = row.querySelectorAll('[class*="col-"]');
            cols.forEach(col => {
                const label = col.querySelector('.text-caption');
                const value = col.querySelector('div:not(.text-caption)');
                
                if (label && value) {
                    const key = label.textContent.trim();
                    const val = value.textContent.trim();
                    
                    // Skip "Catatan"
                    if (key !== 'Catatan') {
                        data[key] = val;
                    }
                }
            });
        });
    }
    
    return data;
}

function scrapeDosenPendamping() {
    const dosen = [];
    const sections = document.querySelectorAll('.q-card__section');
    
    sections.forEach(section => {
        const title = section.querySelector('.color-title');
        if (title && title.textContent.includes('Dosen Pendamping')) {
            const rows = section.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    dosen.push({
                        id: cells[0].textContent.trim(),
                        nama: cells[1].textContent.trim()
                    });
                }
            });
        }
    });
    
    return dosen;
}

function scrapeAnggotaKelompok() {
    const anggota = [];
    const sections = document.querySelectorAll('.q-card__section');
    
    sections.forEach(section => {
        const title = section.querySelector('.color-title');
        if (title && title.textContent.includes('Anggota Kelompok')) {
            const rows = section.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const nimCell = row.querySelector('td:first-child');
                if (nimCell) {
                    const nim = nimCell.textContent.trim();
                    if (nim) {
                        anggota.push(nim);
                    }
                }
            });
        }
    });
    
    return anggota;
}

function scrapeSyaratPendukung() {
    const syarat = [];
    const sections = document.querySelectorAll('.q-card__section');
    
    sections.forEach(section => {
        const title = section.querySelector('.color-title');
        if (title && title.textContent.includes('Syarat Pendukung')) {
            const rows = section.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const nameCell = row.querySelector('td:first-child');
                const button = row.querySelector('button.my-button');
                
                if (nameCell && button) {
                    const icon = button.querySelector('i.material-icons');
                    const iconType = icon ? icon.textContent.trim() : '';
                    
                    syarat.push({
                        nama: nameCell.textContent.trim(),
                        button: button,
                        isLink: iconType === 'link'
                    });
                }
            });
        }
    });
    
    return syarat;
}

async function downloadFromBlob(blobUrl, filename) {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        
        const extension = getFileExtension(blob);
        const fullFilename = filename + extension;
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fullFilename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 50);
        
        return { filename: fullFilename, url: blobUrl };
    } catch (error) {
        return null;
    }
}

function interceptBlobDownload(button, filename) {
    return new Promise((resolve) => {
        let downloaded = false;
        let timeoutId;
        const originalOpen = window.open;
        
        const cleanup = () => {
            window.open = originalOpen;
            clearTimeout(timeoutId);
            resolve(null);
        };
        
        window.open = function(url, target, ...args) {
            if (url && url.startsWith('blob:') && !downloaded) {
                downloaded = true;
                
                downloadFromBlob(url, filename).then((result) => {
                    window.open = originalOpen;
                    clearTimeout(timeoutId);
                    resolve(result);
                });
                
                return {
                    focus: () => {},
                    close: () => {},
                    blur: () => {},
                    closed: false,
                    location: { href: url }
                };
            }
            return originalOpen.apply(this, [url, target, ...args]);
        };
        
        try {
            button.click();
        } catch (error) {
            cleanup();
        }
        
        timeoutId = setTimeout(() => {
            if (!downloaded) cleanup();
        }, 2000);
    });
}

function interceptUrlLink(button) {
    return new Promise((resolve) => {
        const originalOpen = window.open;
        let captured = false;
        let timeoutId;
        
        const cleanup = () => {
            window.open = originalOpen;
            clearTimeout(timeoutId);
            resolve(null);
        };
        
        window.open = function(url, ...args) {
            if (url && !url.startsWith('blob:') && !captured) {
                captured = true;
                window.open = originalOpen;
                clearTimeout(timeoutId);
                resolve(url);
                return { focus: () => {}, close: () => {}, closed: false };
            }
            return originalOpen.apply(this, [url, ...args]);
        };
        
        button.click();
        
        timeoutId = setTimeout(() => {
            if (!captured) cleanup();
        }, 1500);
    });
}

function saveJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 50);
}

async function scrapeAndDownloadAll() {
    console.log('🚀 Processing...');
    
    const mahasiswaData = scrapeMahasiswaData();
    const dosenData = scrapeDosenPendamping();
    const anggotaData = scrapeAnggotaKelompok();
    const syaratList = scrapeSyaratPendukung();
    const syaratPendukung = [];
    
    const jenisKegiatan = sanitizeFilename(mahasiswaData['Jenis Kegiatan'] || 'Kegiatan');
    const nim = mahasiswaData['Nim'] || 'Unknown';
    const tanggalAjuan = sanitizeFilename(mahasiswaData['Tanggal Ajuan'] || 'Unknown');
    
    for (let i = 0; i < syaratList.length; i++) {
        const item = syaratList[i];
        const namaSyarat = sanitizeFilename(item.nama);
        const baseFilename = `${jenisKegiatan}_${nim}_${tanggalAjuan}_${namaSyarat}`;
        
        console.log(`[${i + 1}/${syaratList.length}] ${item.nama}`);
        
        if (item.isLink) {
            const url = await interceptUrlLink(item.button);
            if (url) {
                syaratPendukung.push({ name: baseFilename, url: url });
            }
        } else {
            const result = await interceptBlobDownload(item.button, baseFilename);
            if (result) {
                syaratPendukung.push({ name: result.filename, url: result.url });
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const finalData = {
        mahasiswa: mahasiswaData,
        dosenPendamping: dosenData,
        anggotaKelompok: anggotaData,
        syaratPendukung: syaratPendukung,
        metadata: {
            extractedAt: new Date().toISOString(),
            source: window.location.href
        }
    };
    
    const jsonFilename = `${jenisKegiatan}_${nim}_${tanggalAjuan}.json`;
    saveJSON(finalData, jsonFilename);
    
    console.log(`✅ Done! JSON: ${jsonFilename}`);
    return finalData;
}

scrapeAndDownloadAll();
