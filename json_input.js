// Membuat elemen untuk textarea JSON dan tombol "Proses"
const jsonInputContainer = document.createElement("div");
jsonInputContainer.style.marginBottom = "20px";
jsonInputContainer.style.padding = "20px";
jsonInputContainer.style.border = "1px solid #ddd";
jsonInputContainer.style.borderRadius = "8px";
jsonInputContainer.style.backgroundColor = "#f9f9f9";
jsonInputContainer.style.textAlign = "left";

// Membuat textarea untuk input JSON
const jsonInput = document.createElement("textarea");
jsonInput.id = "json_input";
jsonInput.style.width = "100%";
jsonInput.style.height = "150px";
jsonInput.style.padding = "10px";
jsonInput.style.border = "1px solid #ccc";
jsonInput.style.borderRadius = "5px";
jsonInput.style.fontSize = "14px";
jsonInput.style.fontFamily = "monospace";
jsonInput.style.resize = "none";
jsonInput.style.backgroundColor = "#fff";
jsonInput.placeholder = "Paste JSON Disini...";
jsonInputContainer.appendChild(jsonInput);

// Membuat tombol "Proses"
const processButton = document.createElement("button");
processButton.textContent = "Proses";
processButton.style.marginTop = "15px";
processButton.style.padding = "10px 20px";
processButton.style.border = "none";
processButton.style.borderRadius = "5px";
processButton.style.backgroundColor = "#28a745";
processButton.style.color = "#fff";
processButton.style.fontSize = "16px";
processButton.style.cursor = "pointer";
processButton.style.transition = "background 0.3s, transform 0.2s";
processButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
processButton.style.marginLeft = "10px";

// Hover effects untuk tombol
processButton.onmouseover = () =>
  (processButton.style.backgroundColor = "#218838");
processButton.onmouseout = () =>
  (processButton.style.backgroundColor = "#28a745");
processButton.onmousedown = () =>
  (processButton.style.transform = "scale(0.95)");
processButton.onmouseup = () => (processButton.style.transform = "scale(1)");

jsonInputContainer.appendChild(processButton);

// Menambahkan elemen ini ke halaman, di atas form
const formContainer = document.querySelector(".form-horizontal.style-form");
formContainer.insertBefore(jsonInputContainer, formContainer.firstChild);

// Override fungsi add-row yang existing
const originalAddRow = document.querySelector(".add-row").onclick;
document.querySelector(".add-row").onclick = null;

// Fungsi untuk memeriksa apakah data mahasiswa sudah ada
function isStudentDataExists(nim) {
  const existingRows = document.querySelectorAll("table tbody tr");
  for (const row of existingRows) {
    const existingNim = row.querySelector("td:first-child");
    if (existingNim && existingNim.textContent.trim() === nim) {
      return true;
    }
  }
  return false;
}

// Fungsi untuk menambahkan data mahasiswa secara manual
function addStudentData() {
  const nim = document.getElementById("nim").value;
  const nama = document.getElementById("nama").value;
  const tugas = document.getElementById("tugas").value;

  if (!nim || !nama || !tugas) {
    alert("Mohon lengkapi semua data mahasiswa!");
    return;
  }

  const tbody = document.querySelector("#example tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
        <td>${nim}</td>
        <td>${nama}<input type="hidden" name="mhs[]" value="${nim}|${nama}|${tugas}"></td>
        <td>${tugas}</td>
        <td><button class="btn btn-danger delete-row" onclick="newtest2(this)">Hapus</button></td>
    `;

  tbody.appendChild(tr);

  // Reset form fields
  document.getElementById("nim").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("tugas").value = "";
}

// Fungsi untuk memproses JSON dan mengisi form
processButton.addEventListener("click", () => {
  try {
    const data = JSON.parse(jsonInput.value);

    // Periksa apakah data mahasiswa sudah ada
    if (data.mahasiswa && data.mahasiswa["Nim"]) {
      const nim = data.mahasiswa["Nim"];
      if (isStudentDataExists(nim)) {
        alert("Data mahasiswa dengan NIM ini sudah ada!");
        return;
      }
    }

    // Mengisi form fields
    if (data.mahasiswa) {
      if (data.mahasiswa["Nim"]) {
        document.getElementById("nim").value = data.mahasiswa["Nim"];
      }
      if (data.mahasiswa["Nama Mahasiswa"]) {
        document.getElementById("nama").value =
          data.mahasiswa["Nama Mahasiswa"];
      }
      if (data.mahasiswa["Jenis Kegiatan"]) {
        document.getElementById("tugas").value =
          data.mahasiswa["Jenis Kegiatan"];
      }
    }

    // Mengisi fields lainnya
    if (data.mahasiswa && data.mahasiswa["Nama Kegiatan"]) {
      document.getElementById("non_lomba1").value =
        data.mahasiswa["Nama Kegiatan"];
    }

    const validUrl = data.syaratPendukung.find(
      (item) => !item.url.startsWith("blob:")
    );
    if (validUrl) {
      document.getElementById("non_lomba4").value = validUrl.url;
    }

    if (data.dosenPendamping && data.dosenPendamping[0]) {
      if (data.dosenPendamping[0].id) {
        document.getElementById("dosen_karya").value =
          data.dosenPendamping[0].id;
      }
      if (data.dosenPendamping[0].nama) {
        document.getElementById("search_dosen").value =
          data.dosenPendamping[0].nama;
      }
    }

    // Tambahkan data mahasiswa
    addStudentData();

    // Reset JSON input
    jsonInput.value = "";
  } catch (error) {
    alert("Format JSON tidak valid: " + error.message);
  }
});

// Override tombol add-row yang existing
document.querySelector(".add-row").onclick = addStudentData;
