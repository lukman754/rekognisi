// Style the form elements
const styles = `
.col-sm-12 {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
    }
    .col-sm-12 b {
        color: #333;
        font-size: 14px;
        display: block;
        margin-bottom: 10px;
    }
    input[type="text"] {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
        border: 1px solid #ccc;
        background-color:rgb(255, 255, 255);
        border-radius: 5px;
        transition: all 0.3s;
    }
    input[type="text"]:focus {
        background-color:rgb(255, 255, 255);
    }
    .add-row {
        background: #28a745;
        color: white;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }
    .add-row:hover {
        background: #218838;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }
    th, td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd;
    }
    th {
        background: #007bff;
        color: white;
    }
    tbody tr:nth-child(even) {
        background: #f2f2f2;
    }
.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    border-color: #2196F3;
    outline: none;
    box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #2196F3;
    color: white;
}

.btn-success {
    background-color: #4CAF50;
    color: white;
}

.file-upload {
    margin: 10px 0;
    padding: 15px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    position: relative;
}

.file-name {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
}

.required-field {
    border-color: #ff4444;
}

.error-message {
    color: #ff4444;
    font-size: 12px;
    margin-top: 5px;
}`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Make file inputs required and add file name display
const fileInputs = [
  "non_lomba3",
  "non_lomba5",
  "non_lomba6",
  "upload_dosen_karya",
];

fileInputs.forEach((inputId) => {
  const input = document.getElementById(inputId);
  if (input) {
    // Make input required
    input.setAttribute("required", "required");

    // Create file name display element
    const fileNameDisplay = document.createElement("div");
    fileNameDisplay.className = "file-name";
    fileNameDisplay.id = `${inputId}-filename`;
    input.parentNode.appendChild(fileNameDisplay);

    // Add change event listener
    input.addEventListener("change", function (e) {
      const fileName = e.target.files[0]?.name || "No file selected";
      fileNameDisplay.textContent = `Selected file: ${fileName}`;

      // Validate file size (5MB limit)
      if (e.target.files[0]?.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        fileNameDisplay.textContent = "No file selected";
      }
    });

    // Style the parent container
    input.parentNode.classList.add("file-upload");
  }
});

// Form validation before submit
document.querySelector("form").addEventListener("submit", function (e) {
  let isValid = true;

  fileInputs.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input && !input.files[0]) {
      isValid = false;
      input.classList.add("required-field");

      // Add error message if not exists
      let errorMsg = input.parentNode.querySelector(".error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.textContent = "This file is required";
        input.parentNode.appendChild(errorMsg);
      }
    }
  });

  if (!isValid) {
    e.preventDefault();
    alert("Please fill in all required files");
  }
});

// Add button click handlers for student data
// Hapus event listener yang lama (jika ada)
const oldButton = document.querySelector(".add-row");
const newButton = oldButton.cloneNode(true);
oldButton.parentNode.replaceChild(newButton, oldButton);

// Tambahkan event listener baru
newButton.addEventListener("click", function () {
  const nim = document.getElementById("nim").value;
  const nama = document.getElementById("nama").value;
  const tugas = document.getElementById("tugas").value;

  if (nim && nama && tugas) {
    const tbody = document.querySelector("#example tbody");
    const row = `
            <tr>
                <td>${nim}</td>
                <td>${nama}</td>
                <td>${tugas}</td>
                <td><button class="btn btn-danger delete-row">Hapus</button></td>
            </tr>
        `;
    tbody.insertAdjacentHTML("beforeend", row);

    // Clear inputs
    document.getElementById("nim").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("tugas").value = "";
  } else {
    alert("Mohon isi semua data mahasiswa");
  }
});

// Perbaiki juga event handler untuk delete
const table = document.querySelector("#example");
const newTable = table.cloneNode(true);
table.parentNode.replaceChild(newTable, table);

newTable.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-row")) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      e.target.closest("tr").remove();
    }
  }
});

console.log("Event listeners have been fixed successfully!");
