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
    .btn-danger {
        background-color: #ff4444;
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
    }
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 1000;
        overflow-y: auto;
    }
    .modal-content {
        position: relative;
        margin: 2% auto;
        padding: 20px;
        width: 90%;
        max-width: 800px;
        background: white;
        border-radius: 8px;
        max-height: 90vh;
        overflow-y: auto;
    }
    .close-modal {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 24px;
        cursor: pointer;
        color: #333;
        z-index: 1001;
    }
    .preview-container {
        margin-top: 10px;
        max-height: 70vh;
        overflow-y: auto;
    }
    .preview-actions {
        margin-top: 10px;
        display: flex;
        gap: 10px;
    }
    .file-info {
        margin-top: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create modal container
const modalHTML = `
<div id="previewModal" class="modal">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <div id="previewContent"></div>
    </div>
</div>`;
document.body.insertAdjacentHTML("beforeend", modalHTML);

// File input handling
const fileInputs = [
  "non_lomba3",
  "non_lomba5",
  "non_lomba6",
  "upload_dosen_karya",
];

fileInputs.forEach((inputId) => {
  const input = document.getElementById(inputId);
  if (input) {
    input.setAttribute("required", "required");

    // Create containers
    const fileInfoContainer = document.createElement("div");
    fileInfoContainer.className = "file-info";
    fileInfoContainer.style.display = "none";
    fileInfoContainer.innerHTML = `
            <div class="file-name"></div>
            <div class="preview-actions">
                <button class="preview-btn btn btn-primary" style="z-index: 999;">Preview File</button>
                <button class="remove-file btn btn-danger" style="z-index: 999;">Remove</button>
            </div>
        `;

    input.parentNode.appendChild(fileInfoContainer);
    input.parentNode.classList.add("file-upload");

    // Handle file selection
    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        fileInfoContainer.style.display = "none";
        return;
      }

      // Update file info display
      fileInfoContainer.style.display = "block";
      fileInfoContainer.querySelector(
        ".file-name"
      ).textContent = `Selected file: ${file.name}`;

      // Preview button handler
      fileInfoContainer.querySelector(".preview-btn").onclick = () =>
        showPreview(file);

      // Remove button handler
      fileInfoContainer.querySelector(".remove-file").onclick = () => {
        input.value = "";
        fileInfoContainer.style.display = "none";
      };
    });
  }
});

// Preview handling function
function showPreview(file) {
  const modal = document.getElementById("previewModal");
  const previewContent = document.getElementById("previewContent");
  previewContent.innerHTML = "";

  if (file.type.startsWith("image/")) {
    // Image preview
    const img = document.createElement("img");
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target.result);
    reader.readAsDataURL(file);
    previewContent.appendChild(img);
  } else if (file.type === "application/pdf") {
    // PDF preview
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "80vh";
    iframe.style.border = "none";

    const reader = new FileReader();
    reader.onload = (e) => {
      const pdfUrl = URL.createObjectURL(file);
      iframe.src = pdfUrl;
    };
    reader.readAsArrayBuffer(file);
    previewContent.appendChild(iframe);
  } else {
    // Other file types
    previewContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>Preview not available for this file type</p>
                <p>File name: ${file.name}</p>
                <p>File type: ${file.type || "Unknown"}</p>
                <p>File size: ${(file.size / 1024).toFixed(2)} KB</p>
            </div>
        `;
  }

  modal.style.display = "block";
}

// Modal close handlers
document.querySelector(".close-modal").onclick = function () {
  document.getElementById("previewModal").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("previewModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Form validation before submit
document.querySelector("form").addEventListener("submit", function (e) {
  let isValid = true;

  fileInputs.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input && !input.files[0]) {
      isValid = false;
      input.classList.add("required-field");

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

// Student data handling
const newButton = document.querySelector(".add-row");
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

// Delete row handler
document.querySelector("#example").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-row")) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      e.target.closest("tr").remove();
    }
  }
});
