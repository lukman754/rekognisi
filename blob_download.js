const popup = document.createElement("div");
popup.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  z-index: 1000;
  display: none;
  max-width: 500px;
  width: 90%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// Popup content with modern styling
popup.innerHTML = `
  <h3 style="margin: 0 0 20px 0; font-size: 1.5rem; font-weight: 600; color: #111827;">Download Files</h3>
  
  <div style="margin-bottom: 20px;">
    <select id="inputMethod" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.875rem; background: #f9fafb; color: #374151; outline: none;">
      <option value="">Select Input Method</option>
      <option value="singleLink">Single Link</option>
      <option value="jsonText">JSON Text Input</option>
      <option value="jsonFile">JSON File Upload</option>
    </select>
  </div>

  <div id="singleLinkInput" style="display: none;">
    <input type="text" id="linkUrl" placeholder="Enter URL" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 8px; font-size: 0.875rem;">
    <input type="text" id="customFileName" placeholder="Enter file name (optional)" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 12px; font-size: 0.875rem;">
  </div>

  <div id="jsonTextInput" style="display: none;">
    <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 6px; font-size: 0.875rem; color: #374151;">JSON Format:</label>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #6b7280; padding: 8px; background: #f9fafb; border-radius: 6px;">
            <span>Format: [{"name": "filename", "url": "url"}, ...]</span>
            <button id="pasteJsonBtn" style="padding: 5px 8px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">
                Paste JSON
            </button>
        </div>
    </div>
    <textarea id="jsonText" placeholder="Paste JSON array" style="width: 100%; height: 120px; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 12px; font-size: 0.875rem; resize: vertical;"></textarea>
    <input type="text" id="jsonPrefixInput" placeholder="Enter prefix for all files (optional)" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.875rem; margin-top: 8px;">

    
  </div>

  <div id="jsonFileInput" style="display: none;">
    <div style="margin-bottom: 12px;">
      <label style="display: block; margin-bottom: 6px; font-size: 0.875rem; color: #374151;">JSON Format:</label>
      <div style="font-size: 0.75rem; color: #6b7280; padding: 8px; background: #f9fafb; border-radius: 6px;">
        Format: {"syaratPendukung": [{"name": "filename", "url": "url"}, ...]}
      </div>
    </div>
    <input type="file" id="jsonFile" accept=".json" style="width: 100%; margin-bottom: 12px; font-size: 0.875rem;">
    <input type="text" id="jsonFilePrefixInput" placeholder="Enter prefix for all files (optional)" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.875rem;">
  </div>

  <div id="urlContainer" style="max-height: 200px; overflow-y: auto; margin-top: 16px;"></div>
  
  <div style="display: flex; gap: 12px; margin-top: 20px;">
    <button id="downloadAllBtn" style="flex: 1; background: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: background 0.2s;" disabled>Download All</button>
    <button id="closePopup" style="flex: 1; background: #ef4444; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: background 0.2s;">Close</button>
  </div>
`;

// Add popup to body
document.body.appendChild(popup);

document
  .getElementById("pasteJsonBtn")
  .addEventListener("click", async function () {
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById("jsonText").value = text;

      // Trigger input event to automatically update URL container
      const event = new Event("input", { bubbles: true });
      document.getElementById("jsonText").dispatchEvent(event);
    } catch (err) {
      alert(
        "Gagal mengambil teks dari clipboard. Pastikan Anda memberikan izin."
      );
      console.error(err);
    }
  });

// Create open popup button with modern styling
const openPopupBtn = document.createElement("button");
openPopupBtn.innerText = "Open File Downloader";
openPopupBtn.style.cssText = `
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

openPopupBtn.addEventListener("click", () => {
  popup.style.display = "block"; // Tampilkan popup
  inputMethod.value = "jsonText"; // Set default ke JSON Text Input
  inputMethod.dispatchEvent(new Event("change")); // Trigger perubahan
});

// Create copy button
const copyButton = document.createElement("button");
copyButton.innerText = "Copy sispema.js";
copyButton.style.cssText = `
  position: fixed;
  bottom: 24px;
  right: 220px; /* Geser ke kiri dari openPopupBtn */
  padding: 12px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

// Append both buttons to document
document.body.appendChild(openPopupBtn);
document.body.appendChild(copyButton);

// Function to copy sispema2.js content
async function copySispema2() {
  try {
    const response = await fetch(chrome.runtime.getURL("sispema.js"));
    const text = await response.text();

    await navigator.clipboard.writeText(text);
    alert(
      "Script sispema.js telah disalin ke clipboard! Buka console (CTRL+SHIFT+J) untuk menjalankan program."
    );

    // **Memicu DevTools**
    setTimeout(() => {
      console.log(
        "%cSilakan paste script di sini dan tekan Enter.",
        "color: green; font-size: 16px;"
      );
      console.log(
        "%cTidak bisa paste? Ketik %callow pasting%c di console, lalu coba lagi.",
        "color: red; font-size: 16px;",
        "color: blue; font-size: 16px; font-weight: bold;",
        "color: red; font-size: 16px;"
      );

      console.debug("Membuka DevTools secara tidak langsung...");
    }, 100);
  } catch (error) {
    console.error("Gagal menyalin teks:", error);
    alert("Gagal menyalin teks. Lihat console untuk detail.");
  }
}

// Tambahkan event listener ke tombol copy
copyButton.addEventListener("click", copySispema2);

// Hover effects
openPopupBtn.addEventListener("mouseover", () => {
  openPopupBtn.style.background = "#2563eb";
});
openPopupBtn.addEventListener("mouseout", () => {
  openPopupBtn.style.background = "#3b82f6";
});

// Get elements
const inputMethod = popup.querySelector("#inputMethod");
const singleLinkInput = popup.querySelector("#singleLinkInput");
const jsonTextInput = popup.querySelector("#jsonTextInput");
const jsonFileInput = popup.querySelector("#jsonFileInput");
const urlContainer = popup.querySelector("#urlContainer");
const closePopupBtn = popup.querySelector("#closePopup");
const downloadAllBtn = popup.querySelector("#downloadAllBtn");
const linkUrlInput = popup.querySelector("#linkUrl");
const customFileNameInput = popup.querySelector("#customFileName");
const jsonTextArea = popup.querySelector("#jsonText");
const jsonPrefixInput = popup.querySelector("#jsonPrefixInput");
const jsonFileUpload = popup.querySelector("#jsonFile");
const jsonFilePrefixInput = popup.querySelector("#jsonFilePrefixInput");

// Store URLs and file names
let currentFiles = [];

// Custom button style for URL container
const buttonStyle = `
  width: 100%;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
`;

// Input method selection handler
inputMethod.addEventListener("change", () => {
  singleLinkInput.style.display = "none";
  jsonTextInput.style.display = "none";
  jsonFileInput.style.display = "none";
  urlContainer.innerHTML = "";
  currentFiles = [];
  downloadAllBtn.disabled = true;

  switch (inputMethod.value) {
    case "singleLink":
      singleLinkInput.style.display = "block";
      break;
    case "jsonText":
      jsonTextInput.style.display = "block";
      break;
    case "jsonFile":
      jsonFileInput.style.display = "block";
      break;
  }
});

// Single link input handler
linkUrlInput.addEventListener("input", () => {
  const url = linkUrlInput.value.trim();
  if (url) {
    currentFiles = [
      {
        url,
        name: customFileNameInput.value.trim() || "File 1",
        isBlob: url.startsWith("blob:"),
      },
    ];
    updateUrlContainer();
  }
});

// JSON text input handler
// Modified JSON text input handler
jsonTextArea.addEventListener("input", () => {
  try {
    const jsonData = JSON.parse(jsonTextArea.value);
    if (Array.isArray(jsonData)) {
      currentFiles = jsonData.map((item) => ({
        url: item.url,
        name: item.name,
        isBlob: item.url.startsWith("blob:"),
      }));
      updateUrlContainer();
    }
  } catch (error) {
    // Optional: Clear currentFiles if JSON is invalid
    currentFiles = [];
    urlContainer.innerHTML = "";
    downloadAllBtn.disabled = true;
    console.error("Invalid JSON format");
  }
});

// Add input event listener to prefix inputs to trigger update
jsonPrefixInput.addEventListener("input", () => {
  if (currentFiles.length > 0) {
    updateUrlContainer();
  }
});

jsonFilePrefixInput.addEventListener("input", () => {
  if (currentFiles.length > 0) {
    updateUrlContainer();
  }
});

// JSON file input handler
jsonFileUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const jsonText = await file.text();
    const jsonData = JSON.parse(jsonText);

    if (jsonData.syaratPendukung && Array.isArray(jsonData.syaratPendukung)) {
      currentFiles = jsonData.syaratPendukung.map((item) => ({
        url: item.url,
        name: item.name,
        isBlob: item.url.startsWith("blob:"),
      }));
      updateUrlContainer();
    }
  } catch (error) {
    console.error("Error processing JSON:", error);
    alert("Failed to process JSON file");
  }
});

// Update URL container
function updateUrlContainer() {
  urlContainer.innerHTML = "";
  currentFiles.forEach((file) => {
    const prefix =
      inputMethod.value === "jsonText"
        ? jsonPrefixInput.value.trim()
        : jsonFilePrefixInput.value.trim();

    const displayName = prefix ? `${prefix}_${file.name}` : file.name;

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = `Download ${displayName}`;
    downloadBtn.style.cssText = buttonStyle;

    downloadBtn.addEventListener("mouseover", () => {
      downloadBtn.style.background = "#e5e7eb";
    });
    downloadBtn.addEventListener("mouseout", () => {
      downloadBtn.style.background = "#f3f4f6";
    });

    downloadBtn.onclick = () => {
      const currentPrefix =
        inputMethod.value === "jsonText"
          ? jsonPrefixInput.value.trim()
          : jsonFilePrefixInput.value.trim();
      downloadFile(file, currentPrefix);
    };
    urlContainer.appendChild(downloadBtn);
  });
  downloadAllBtn.disabled = currentFiles.length === 0;
}

// Download file function
// Single link input handlers
linkUrlInput.addEventListener("input", updateSingleLinkFiles);
customFileNameInput.addEventListener("input", updateSingleLinkFiles);

function updateSingleLinkFiles() {
  const url = linkUrlInput.value.trim();
  const customName = customFileNameInput.value.trim();

  if (url) {
    currentFiles = [
      {
        url,
        name: customName || "File 1", // Use custom name or default
        isBlob: url.startsWith("blob:"),
      },
    ];
    updateUrlContainer();
  }
}

// Modify the downloadFile function to use the provided name
async function downloadFile(file, prefix) {
  try {
    if (file.isBlob) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const contentType = response.headers.get("content-type");
      const ext = getFileExtension(contentType);

      // Use provided name with optional prefix
      const filename = prefix
        ? `${prefix}_${file.name}${ext}`
        : `${file.name}${ext}`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const blob = new Blob([file.url], { type: "text/plain" });

      // Use provided name with optional prefix
      const filename = prefix
        ? `${prefix}_${file.name}.txt`
        : `${file.name}.txt`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error(`Download error for file: ${file.name}`, error);
    alert("Download failed");
  }
}

// Download all files
downloadAllBtn.addEventListener("click", async () => {
  if (currentFiles.length === 0) {
    alert("No files to download");
    return;
  }

  const currentPrefix =
    inputMethod.value === "jsonText"
      ? jsonPrefixInput.value.trim()
      : jsonFilePrefixInput.value.trim();

  for (const file of currentFiles) {
    await downloadFile(file, currentPrefix);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
});

// Open/Close popup handlers
openPopupBtn.addEventListener("click", () => {
  popup.style.display = "block";
});

closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// Get file extension helper
function getFileExtension(contentType) {
  if (contentType.includes("pdf")) return ".pdf";
  if (contentType.includes("image")) return ".png";
  return ".bin";
}
