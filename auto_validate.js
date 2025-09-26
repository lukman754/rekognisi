// Fungsi untuk monitor network request dan deteksi error
function setupNetworkMonitor() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (args[0] && typeof args[0] === 'string' && 
                args[0].includes('/rekognisi/validasi/') && 
                response.status === 400) {
                setTimeout(() => {
                    clickBatalButton();
                }, 1000);
                window.validationError = true;
            } else if (args[0] && typeof args[0] === 'string' && 
                       args[0].includes('/rekognisi/validasi/') && 
                       response.status >= 200 && response.status < 300) {
                window.validationSuccess = true;
            }
            return response;
        }).catch(error => {
            window.validationError = true;
            return Promise.reject(error);
        });
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                if (this._method === 'PATCH' && 
                    this._url && this._url.includes('/rekognisi/validasi/')) {
                    if (this.status === 400) {
                        setTimeout(() => {
                            clickBatalButton();
                        }, 1000);
                        window.validationError = true;
                    } else if (this.status >= 200 && this.status < 300) {
                        window.validationSuccess = true;
                    }
                }
            }
        });
        return originalXHRSend.apply(this, args);
    };
}

// Fungsi untuk validasi semua baris dalam tabel
async function validateAllRows() {
    const startTime = Date.now();
    console.log('MEMULAI VALIDASI SEMUA BARIS DALAM TABEL');
    
    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;
    const processedRows = [];
    
    const allEditButtons = document.querySelectorAll('table.q-table .q-btn.bg-yellow-9');
    console.log(`Ditemukan ${allEditButtons.length} baris untuk divalidasi\n`);
    
    if (allEditButtons.length === 0) {
        console.log('Tidak ada tombol edit ditemukan dalam tabel');
        return;
    }
    
    for (let i = 0; i < allEditButtons.length; i++) {
        const currentButtons = document.querySelectorAll('table.q-table .q-btn.bg-yellow-9');
        
        if (i >= currentButtons.length) {
            break;
        }
        
        const editButton = currentButtons[i];
        const row = editButton.closest('tr');
        const nim = row ? row.querySelector('td:first-child')?.textContent?.trim() : `Row ${i+1}`;
        const nama = row ? row.querySelector('td:nth-child(2)')?.textContent?.trim() : '';
        
        console.log(`[${i+1}/${allEditButtons.length}] ${nim} - ${nama}`);
        
        window.validationError = false;
        window.validationSuccess = false;
        
        try {
            editButton.click();
            
            let dialogOpen = null;
            for (let attempts = 0; attempts < 15; attempts++) {
                dialogOpen = document.querySelector('.q-dialog, .my-dialog-card, .q-card');
                if (dialogOpen) break;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!dialogOpen) {
                processedRows.push({ nim, nama, status: 'SKIP' });
                skipCount++;
                continue;
            }
            
            const result = await performValidationAutomationFixed();
            
            if (result === 'success') {
                processedRows.push({ nim, nama, status: 'SUCCESS' });
                successCount++;
                await new Promise(resolve => setTimeout(resolve, 800));
            } else if (result === 'error') {
                processedRows.push({ nim, nama, status: 'ERROR' });
                errorCount++;
                await closeAnyOpenDialog();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                processedRows.push({ nim, nama, status: 'SKIP' });
                skipCount++;
                await closeAnyOpenDialog();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
        } catch (error) {
            processedRows.push({ nim, nama, status: 'ERROR' });
            errorCount++;
            await closeAnyOpenDialog();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    
    console.log('\n========================================');
    console.log('LAPORAN VALIDASI SELESAI');
    console.log('========================================');
    console.log(`Waktu penyelesaian: ${minutes} menit ${seconds} detik`);
    console.log(`Total berhasil: ${successCount}`);
    console.log(`Total gagal: ${errorCount}`);
    console.log(`Total dilewati: ${skipCount}`);
    console.log(`Total diproses: ${allEditButtons.length}\n`);
    
    console.log('DETAIL HASIL PER BARIS:');
    console.log('----------------------------------------');
    processedRows.forEach((row, index) => {
        const statusIcon = row.status === 'SUCCESS' ? '✅' : 
                          row.status === 'ERROR' ? '❌' : '⚠️';
        console.log(`${index + 1}. ${row.nim} - ${row.nama} ${statusIcon} ${row.status}`);
    });
    console.log('========================================');
}

// Fungsi untuk melakukan automasi validasi
async function performValidationAutomationFixed() {
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const labels = document.querySelectorAll('.q-field__label');
        let statusValidasiField = null;
        
        labels.forEach(label => {
            if (label.textContent.includes('Status Validasi')) {
                statusValidasiField = label.closest('.q-field');
            }
        });
        
        if (!statusValidasiField) {
            return 'skip';
        }
        
        statusValidasiField.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const firstOption = await selectFirstOptionFixed();
        
        if (firstOption) {
            firstOption.click();
            await new Promise(resolve => setTimeout(resolve, 300));
        } else {
            const selectInput = statusValidasiField.querySelector('.q-select__focus-target') || 
                               statusValidasiField.querySelector('input[role="combobox"]');
            
            if (selectInput) {
                selectInput.focus();
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const arrowDownEvent = new KeyboardEvent('keydown', { 
                    key: 'ArrowDown', 
                    code: 'ArrowDown',
                    bubbles: true 
                });
                selectInput.dispatchEvent(arrowDownEvent);
                
                await new Promise(resolve => setTimeout(resolve, 150));
                
                const enterEvent = new KeyboardEvent('keydown', { 
                    key: 'Enter', 
                    code: 'Enter',
                    bubbles: true 
                });
                selectInput.dispatchEvent(enterEvent);
                
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                return 'skip';
            }
        }
        
        const textarea = document.querySelector('textarea[aria-label="Catatan *"]') || 
                         document.querySelector('textarea[id*="f_"]') ||
                         document.querySelector('.q-textarea textarea');
        
        if (textarea) {
            textarea.focus();
            textarea.value = 'ok';
            
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            
            await new Promise(resolve => setTimeout(resolve, 200));
        } else {
            return 'skip';
        }
        
        const buttons = document.querySelectorAll('.q-btn');
        let saveBtn = null;
        
        buttons.forEach((btn, i) => {
            if (btn.textContent.includes('SIMPAN')) {
                saveBtn = btn;
            }
        });
        
        if (saveBtn) {
            saveBtn.click();
            await waitForValidationResponse();
            
            if (window.validationSuccess) {
                return 'success';
            } else if (window.validationError) {
                return 'error';
            } else {
                return 'skip';
            }
        } else {
            return 'skip';
        }
        
    } catch (error) {
        return 'error';
    }
}

// Fungsi untuk mencari opsi pertama
async function selectFirstOptionFixed() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const selectors = [
        '.q-menu .q-item:first-child',
        '.q-select__dropdown .q-item:first-child', 
        '.q-virtual-scroll .q-item:first-child',
        '.q-menu [role="option"]:first-child',
        '.q-menu div[tabindex]:first-child',
        '.q-select__dropdown div[tabindex]:first-child',
        '.q-menu .q-list > div:first-child',
        '.q-portal .q-menu .q-item:first-child'
    ];
    
    let firstOption = null;
    for (let selector of selectors) {
        firstOption = document.querySelector(selector);
        if (firstOption && firstOption.textContent.trim() !== '') {
            break;
        }
    }
    
    return firstOption;
}

// Fungsi untuk menunggu response validasi
async function waitForValidationResponse(maxWait = 8000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
        if (window.validationSuccess || window.validationError) {
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
}

// Fungsi untuk menutup dialog yang terbuka
async function closeAnyOpenDialog() {
    let batalButton = null;
    const buttons = document.querySelectorAll('.q-btn');
    buttons.forEach(btn => {
        if (btn.textContent.includes('BATAL')) {
            batalButton = btn;
        }
    });
    
    if (batalButton) {
        batalButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
        return;
    }
    
    const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true
    });
    document.dispatchEvent(escEvent);
    await new Promise(resolve => setTimeout(resolve, 300));
}

// Fungsi untuk klik tombol BATAL
function clickBatalButton() {
    let batalButton = null;
    
    const buttons = document.querySelectorAll('.q-btn');
    buttons.forEach(btn => {
        if (btn.textContent.includes('BATAL')) {
            batalButton = btn;
        }
    });
    
    if (!batalButton) {
        batalButton = document.querySelector('.q-btn--outline');
        if (batalButton && batalButton.textContent.includes('BATAL')) {
            // Found it
        } else {
            batalButton = null;
        }
    }
    
    if (!batalButton) {
        const dialog = document.querySelector('.my-dialog-card, .q-card');
        if (dialog) {
            const dialogButtons = dialog.querySelectorAll('.q-btn');
            dialogButtons.forEach(btn => {
                if (btn.textContent.includes('BATAL')) {
                    batalButton = btn;
                }
            });
        }
    }
    
    if (batalButton) {
        batalButton.click();
    } else {
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            bubbles: true
        });
        document.dispatchEvent(escEvent);
    }
}

// Fungsi untuk automasi single dialog
async function autoFillDialog() {
    const openButton = document.querySelector('.q-btn.bg-yellow-9');
    if (openButton) {
        openButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let selectField = null;
        const labels = document.querySelectorAll('.q-field__label');
        labels.forEach(label => {
            if (label.textContent.includes('Status Validasi')) {
                selectField = label.closest('.q-field');
            }
        });
        
        if (selectField) {
            selectField.click();
            const firstOption = await selectFirstOptionFixed();
            
            if (firstOption) {
                firstOption.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                const selectInput = selectField.querySelector('.q-select__focus-target') || 
                                   selectField.querySelector('input[role="combobox"]');
                
                if (selectInput) {
                    selectInput.focus();
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    const arrowDownEvent = new KeyboardEvent('keydown', { 
                        key: 'ArrowDown', 
                        code: 'ArrowDown',
                        bubbles: true 
                    });
                    selectInput.dispatchEvent(arrowDownEvent);
                    
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    const enterEvent = new KeyboardEvent('keydown', { 
                        key: 'Enter', 
                        code: 'Enter',
                        bubbles: true 
                    });
                    selectInput.dispatchEvent(enterEvent);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
        
        const textarea = document.querySelector('textarea[aria-label="Catatan *"]') || 
                         document.querySelector('textarea[id*="f_"]') ||
                         document.querySelector('.q-textarea textarea');
        if (textarea) {
            textarea.focus();
            textarea.value = 'ok';
            
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        let saveBtn = null;
        const buttons = document.querySelectorAll('.q-btn');
        buttons.forEach(btn => {
            if (btn.textContent.includes('SIMPAN')) {
                saveBtn = btn;
            }
        });
        
        if (saveBtn) {
            saveBtn.click();
            console.log('Automasi selesai!');
        }
    }
}

// Setup dan jalankan
console.log('=== AUTOMASI DIALOG VALIDASI REKOGNISI ===');
setupNetworkMonitor();

console.log('Pilihan automasi:');
console.log('1. Untuk validasi SATU baris: autoFillDialog()');
console.log('2. Untuk validasi SEMUA baris: validateAllRows()');

window.autoFillDialog = autoFillDialog;
window.validateAllRows = validateAllRows;

console.log('\nAuto-start untuk satu baris dalam 2 detik...');
console.log('(Atau ketik validateAllRows() untuk memproses semua baris)');

setTimeout(() => {
    autoFillDialog().catch(error => {
        console.log('Automasi gagal:', error);
    });
}, 2000);
