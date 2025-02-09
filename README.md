# 📌 Panduan Penggunaan Ekstensi Rekognisi & Folder Organizer  

Tutorial ini akan memandu Anda dalam **menggunakan ekstensi Rekognisi untuk mengekstrak data dari website Sistema, mengelompokkan file secara otomatis dengan Folder Organizer, dan menginput data ke Simkatmawa secara otomatis.**  

---

## 📥 1. Persiapan Awal  

### 🔹 1.1. Download Alat yang Dibutuhkan  
Pastikan Anda sudah mengunduh alat berikut sebelum memulai:  

1. **Folder Organizer**  
   - 📥 **[Download Folder Organizer (Folder_manager.exe)](https://drive.google.com/file/d/1eBH52lpUrliAttj9rBNc6uPQXuCbTbly/view?usp=sharing)**  

2. **Ekstensi Rekognisi**  
   - 📥 **[Download Ekstensi Rekognisi](https://github.com/lukman754/rekognisi/archive/refs/heads/main.zip)**  

---

## 🔧 2. Instalasi dan Penggunaan Ekstensi Rekognisi  

### ✅ 2.1. Instalasi Ekstensi di Google Chrome  
1. **Ekstrak file ZIP** yang telah diunduh.  
2. Buka **Google Chrome**.  
3. Masuk ke halaman ekstensi dengan membuka: chrome://extensions/
4. Aktifkan **Mode Pengembang (Developer Mode)** di pojok kanan atas.  
5. Klik **Muat Ekstensi yang Belum Dikemas**.  
6. Pilih folder hasil ekstraksi ekstensi Rekognisi.  
7. **Ekstensi berhasil diinstal**, dan akan muncul tombol tambahan di website Sistema.  

### 🚀 2.2. Menggunakan Ekstensi di Website Sistema 
 
1. **Buka website Sistema**.  
2. Setelah ekstensi terpasang, tombol berikut akan muncul:  
- 🟢 **File Downloader** → Untuk mengunduh data dari website.  
- 🔄 **Filter Ganjil / Genap** → Memfilter tahun semester.  
- 📋 **Copy Script** → Menyalin script untuk dipaste di konsol browser.  

### 🖥️ 2.3. Menjalankan Script di Konsol Browser  
1. Buka **Developer Tools (Konsol)** dengan:  
- **Windows** → Tekan **F12** atau **Ctrl + Shift + J**.  
- **Mac** → Tekan **Cmd + Option + J**.  
2. Klik tombol **Copy Script** di website.  
3. **Paste script** ke konsol lalu tekan **Enter**.  
4. Data akan diproses dan dapat diunduh ke komputer Anda.

<img width="960" alt="{3C697473-119D-43C3-BDC1-6D3CE6AE098A}" src="https://github.com/user-attachments/assets/88d5db7b-eee2-4af9-bd24-897be6cc112d" />

### 🚀 Fitur Utama  
✅ **Ekstrak Data** → Mengambil semua informasi rekognisi beserta file terkait.  
✅ **Copy JSON** → Menyalin hasil ekstraksi dalam format JSON.  
✅ **Paste JSON** → Menempelkan JSON ke File Downloader untuk mengunduh semua file secara otomatis.  
✅ **Download All** → Mengunduh semua file dari JSON yang telah ditempelkan.  



### 📌 Cara Menggunakan  

1️⃣ **Klik "Ekstrak Data"** → Untuk mengambil semua data rekognisi dan file yang ada.  
2️⃣ **Klik "Copy JSON"** → Untuk menyalin hasil ekstraksi dalam format JSON.  
3️⃣ **Buka File Downloader** → Klik **"Paste JSON"** untuk menempelkan JSON yang telah disalin.  
4️⃣ **Klik "Download All"** → Untuk mengunduh semua file dari JSON yang telah ditempelkan.  


## ⚠️ Peringatan Penting!  


### 🚨 1. Tidak Bisa Paste di Console?  
Jika saat melakukan paste di **DevTools Console** muncul **peringatan warna kuning** seperti ini:  

```
Warning: Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type ‘allow pasting’ below and hit Enter to allow pasting.
```

🔹 **Solusi:**
Ketik perintah berikut di console, lalu tekan Enter:
```
allow pasting
```
Setelah itu, coba paste ulang kode yang ingin dijalankan.

### 🚨 2. Jangan Refresh Halaman!  
Jika halaman di-refresh, maka **card "Proses Log & Data" dan "Ekstraktor" akan hilang**.  

🔹 **Solusi:**  
Jalankan kembali script di console untuk menampilkan card tersebut.  

---

## 📂 3. Mengelompokkan File dengan Folder Organizer   
<img width="960" alt="{2A509909-C30C-4BE0-9DB2-2927CA4C07C3}" src="https://github.com/user-attachments/assets/25c91d4a-065d-4fa0-aa59-177910caaafc" />


### 🚀 3.1. Fitur Utama  
✅ **Otomatis Mengelompokkan File** → Berdasarkan tipe, nama, atau aturan khusus.  
✅ **Dukungan Berbagai Format** → Dokumen, gambar, video, dan lainnya.  
✅ **Atur Nama & Struktur Folder** → Bisa dikonfigurasi sesuai kebutuhan.  
✅ **Pemantauan Real-Time** → Folder selalu terorganisir dengan baik.  

### 📌 3.2. Membuat Folder untuk Penyimpanan File  
1. Buka **File Explorer** (Windows) atau **Finder** (Mac).  
2. **Buat folder baru** dengan nama **Rekognisi**.  
3. **Atur lokasi download di browser Chrome** agar file hasil ekstraksi langsung tersimpan ke folder ini:  
- **Buka Google Chrome** → **Setelan** → **Lanjutan** → **Unduhan**.  
- Klik **Ubah**, lalu pilih folder **Rekognisi**.  
- Pastikan **"Tanya setiap kali sebelum mengunduh"** **tidak dicentang**.  

### 🏗️ 3.3. Menjalankan Folder Organizer  
1. **Buka Folder Organizer** (jalankan **Folder_manager.exe**).  
2. Klik **Select Folder**, lalu pilih folder **Rekognisi**.  
3. Klik **Grouping File** Folder Organizer akan otomatis mengelompokkan file berdasarkan nama.  

### 📂 3.4. Contoh Hasil Pengelompokan Folder  
Misalkan file hasil download memiliki nama sebagai berikut:  
```
rekognisi_2023_1.pdf
rekognisi_2023_2.png
rekognisi_2024_1.pdf
rekognisi_2024_2.png
rekognisi_data_2023.json
rekognisi_data_2024.json
laporan_keuangan_2023.txt
laporan_keuangan_2024.txt
```

Setelah dijalankan, struktur folder akan menjadi seperti ini:  
```
/Rekognisi/
/rekognisi_2023/
rekognisi_2023_1.pdf
rekognisi_2023_2.png
rekognisi_data_2023.json
laporan_keuangan_2023.txt
/rekognisi_2024/
rekognisi_2024_1.pdf
rekognisi_2024_2.png
rekognisi_data_2024.json
laporan_keuangan_2024.txt
```


### 🖱️ 3.5. Mengelola File di Folder Organizer  
- **Jika mengklik file PDF atau PNG**, maka **path file** akan otomatis disalin ke clipboard.  
- **Jika mengklik file JSON atau TXT**, maka **isi file** akan otomatis disalin ke clipboard.  

---

## 📋 4. Auto-Input Data di Simkatmawa  

### 🔗 4.1. Membuka Simkatmawa  
1. Buka **website Simkatmawa** di browser.  
2. Akan muncul **kotak input untuk paste JSON**.  

### 📥 4.2. Paste Data JSON dari Folder Organizer  
1. Klik **file JSON** di **Folder Organizer** untuk menyalin isinya.  
2. **Paste** JSON tersebut ke kotak input di **Simkatmawa**.  
3. Data di form akan otomatis terisi berdasarkan JSON yang dipaste.  

### ⚡ 4.3. Menggunakan Auto-Input untuk File Path atau Teks  
1. Klik tombol **Start Auto-Input** di Simkatmawa.  
2. Pilih **file PDF atau PNG** di Folder Organizer untuk menyalin **path**.  
3. Pilih **file TXT atau JSON** di Folder Organizer untuk menyalin **isinya**.  
4. Klik **Form Input File** di Simkatmawa → Path atau teks akan otomatis dipaste di sana.  

---

## 🎯 Kesimpulan  
Dengan mengikuti tutorial ini, Anda dapat:  
✅ **Menggunakan ekstensi di Sistema** untuk ekstrak dan download data.  
✅ **Mengelompokkan file otomatis** dengan Folder Organizer.  
✅ **Menyalin data** (path file atau isi file) dengan sekali klik.  
✅ **Menggunakan auto-input di Simkatmawa** untuk memudahkan pengisian data.  




