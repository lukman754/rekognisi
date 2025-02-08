// Membuat elemen untuk textarea JSON dan tombol "Paste JSON" dan "Proses"
const jsonInputContainer = document.createElement("div");
jsonInputContainer.style.marginBottom = "20px";

// Membuat textarea untuk input JSON
const jsonInput = document.createElement("textarea");
jsonInput.id = "json_input";
jsonInput.style.width = "100%";
jsonInput.style.height = "150px";
jsonInput.placeholder = "Paste JSON Disini";
jsonInputContainer.appendChild(jsonInput);

// Membuat tombol "Proses" untuk memproses dan mengisi form
const processButton = document.createElement("button");
processButton.textContent = "Proses";
processButton.className = "btn btn-success";
processButton.style.marginTop = "10px";
jsonInputContainer.appendChild(processButton);

// Menambahkan elemen ini ke halaman, di atas form
const formContainer = document.querySelector(".form-horizontal.style-form");
formContainer.insertBefore(jsonInputContainer, formContainer.firstChild);

// Fungsi untuk memproses JSON dan mengisi form
processButton.addEventListener("click", () => {
  try {
    const data = JSON.parse(jsonInput.value);

    // Pastikan ada data yang dibutuhkan sebelum mengisi form
    if (data.mahasiswa && data.mahasiswa["Nama Kegiatan"]) {
      document.getElementById("non_lomba1").value =
        data.mahasiswa["Nama Kegiatan"];
    }

    const validUrl = data.syaratPendukung.find(
      (item) => !item.url.startsWith("blob:")
    );

    if (validUrl) {
      document.getElementById("non_lomba4").value = validUrl.url; // Mengambil URL yang valid
    }

    if (
      data.dosenPendamping &&
      data.dosenPendamping[0] &&
      data.dosenPendamping[0].id
    ) {
      document.getElementById("dosen_karya").value = data.dosenPendamping[0].id;
    }

    if (
      data.dosenPendamping &&
      data.dosenPendamping[0] &&
      data.dosenPendamping[0].nama
    ) {
      document.getElementById("search_dosen").value =
        data.dosenPendamping[0].nama;
    }

    if (data.mahasiswa && data.mahasiswa["Nim"]) {
      document.getElementById("nim").value = data.mahasiswa["Nim"];
    }

    if (data.mahasiswa && data.mahasiswa["Nama Mahasiswa"]) {
      document.getElementById("nama").value = data.mahasiswa["Nama Mahasiswa"];
    }

    if (data.mahasiswa && data.mahasiswa["Jenis Kegiatan"]) {
      document.getElementById("tugas").value = data.mahasiswa["Jenis Kegiatan"];
    }

    // Men-trigger tombol "Tambah Data Mahasiswa" setelah form terisi
    triggerAddRowButton();
  } catch (error) {
    alert("Invalid JSON format");
  }
});

// Fungsi untuk memicu tombol "Tambah Data Mahasiswa"
function triggerAddRowButton() {
  const nim = document.getElementById("nim").value;
  const nama = document.getElementById("nama").value;
  const tugas = document.getElementById("tugas").value;

  // Memeriksa apakah semua field sudah terisi
  if (nim && nama && tugas) {
    // Jika semua data terisi, klik tombol "Tambah Data Mahasiswa"
    document.querySelector(".add-row").click();
  }
}
