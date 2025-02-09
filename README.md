# Dokumentasi Ekstensi Rekognisi & Folder Organizer

## Pendahuluan
Dokumentasi ini akan memandu Anda dalam menggunakan ekstensi Rekognisi untuk mengekstrak data dari website Sispema, mengelola file secara otomatis dengan Folder Organizer, dan melakukan input data otomatis ke Simkatmawa.

## Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Penggunaan Folder Organizer](#penggunaan-folder-organizer)
3. [Instalasi Ekstensi Rekognisi](#instalasi-ekstensi-rekognisi)
4. [Penggunaan Ekstensi Rekognisi](#penggunaan-ekstensi-rekognisi)
5. [Auto-Input Simkatmawa](#auto-input-simkatmawa)
6. [Penyelesaian Masalah](#penyelesaian-masalah)

## Persiapan Awal

### Alat yang Diperlukan
1. Folder Organizer
   - Unduh [Folder_manager.exe](https://drive.google.com/file/d/1eBH52lpUrliAttj9rBNc6uPQXuCbTbly/view?usp=sharing)
2. Ekstensi Rekognisi
   - Unduh [File Ekstensi](https://github.com/lukman754/rekognisi/archive/refs/heads/main.zip)

## Penggunaan Folder Organizer
<img width="960" alt="{2A509909-C30C-4BE0-9DB2-2927CA4C07C3}" src="https://github.com/user-attachments/assets/25c91d4a-065d-4fa0-aa59-177910caaafc" />

### Persiapan Folder
1. Buat folder baru bernama "Rekognisi"
2. Atur lokasi unduhan Chrome ke folder tersebut:
   - Buka Setelan Chrome
   - Pilih menu Unduhan
   - Ubah lokasi ke folder Rekognisi
   - Nonaktifkan "Tanya setiap kali sebelum mengunduh"

### Menjalankan Folder Organizer
1. Buka Folder_manager.exe
2. Klik "Select Folder" dan pilih folder Rekognisi
3. Klik "Grouping File" untuk mengelompokkan file otomatis

### Fitur Tambahan
- Klik file PDF/PNG: Menyalin path file
- Klik file JSON/TXT: Menyalin isi file


## Instalasi Ekstensi Rekognisi

### Langkah-langkah Instalasi
1. Ekstrak file ZIP ekstensi yang sudah diunduh
2. Buka Google Chrome
3. Kunjungi halaman ekstensi dengan mengetik: chrome://extensions/
4. Aktifkan "Mode Pengembang" di pojok kanan atas
5. Klik "Muat Ekstensi yang Belum Dikemas" atau "Load Unpacked"
6. Pilih folder hasil ekstraksi ekstensi Rekognisi
7. Tunggu hingga ekstensi berhasil terpasang

## Penggunaan Ekstensi Rekognisi
<img width="960" alt="{3C697473-119D-43C3-BDC1-6D3CE6AE098A}" src="https://github.com/user-attachments/assets/88d5db7b-eee2-4af9-bd24-897be6cc112d" />

### Fitur Utama
1. File Downloader
   - Fungsi: Mengunduh data dari website
   - Cara penggunaan: Klik tombol "File Downloader" yang muncul di website

2. Filter Semester
   - Fungsi: Memfilter tahun semester (ganjil/genap)
   - Cara penggunaan: Gunakan tombol "Filter Ganjil/Genap"

3. Copy Script
   - Fungsi: Menyalin script untuk dijalankan di konsol browser
   - Cara penggunaan: Klik tombol "Copy Script"

### Cara Menggunakan
1. Buka website Sispema
2. Jalankan script di konsol browser:
   - Windows: Tekan F12 atau Ctrl + Shift + J
   - Mac: Tekan Cmd + Option + J
3. Tempel script yang sudah disalin
4. Tekan Enter untuk menjalankan

### Ekstraksi Data
1. Klik "Ekstrak Data" untuk mengambil informasi rekognisi
2. Klik "Copy JSON" untuk menyalin hasil ekstraksi
3. Buka File Downloader dan klik "Paste JSON"
4. Klik "Download All" untuk mengunduh semua file

## Auto-Input Simkatmawa

### Langkah-langkah
1. Buka website Simkatmawa
2. Salin isi file JSON dari Folder Organizer
3. Tempel ke kotak input di Simkatmawa
4. Data akan terisi otomatis

### Auto-Input File
1. Klik "Start Auto-Input" di Simkatmawa
2. Pilih file di Folder Organizer:
   - PDF/PNG: Menyalin path file
   - TXT/JSON: Menyalin isi file
3. Klik form input di Simkatmawa untuk mengisi otomatis

## Penyelesaian Masalah

### Masalah Paste di Console
Jika muncul peringatan saat melakukan paste:
1. Ketik "allow pasting" di console
2. Tekan Enter
3. Coba paste ulang kode

### Halaman Di-refresh
Jika card "Proses Log & Data" dan "Ekstraktor" hilang:
1. Jalankan ulang script di console
2. Tunggu hingga card muncul kembali

### Tips Penting
- Jangan refresh halaman saat proses ekstraksi
- Pastikan folder tersimpan di lokasi yang mudah diakses
- Periksa koneksi internet sebelum mengunduh file
