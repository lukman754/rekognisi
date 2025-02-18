// Create container for semester buttons and copy button
const buttonContainer = document.createElement("div");
buttonContainer.style.cssText = `
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90vw;
`;

// Cache management for file downloader
const FileDownloaderCache = {
  CACHE_KEY: "sispema_file_downloader_state",

  saveState() {
    const jsonText = document.getElementById("jsonText").value;
    const jsonPrefix = document.getElementById("jsonPrefixInput").value;

    localStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify({
        jsonText,
        jsonPrefix,
      })
    );
  },

  restoreState() {
    const cachedState = localStorage.getItem(this.CACHE_KEY);
    if (cachedState) {
      const { jsonText, jsonPrefix } = JSON.parse(cachedState);

      document.getElementById("jsonText").value = jsonText;
      document.getElementById("jsonPrefixInput").value = jsonPrefix;

      // Trigger input event to process the JSON
      document.getElementById("jsonText").dispatchEvent(new Event("input"));
    }
  },
};

// Auto-paste functionality
function setupAutoPasteObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const preTags = document.querySelectorAll("pre.default_cursor_cs");
        preTags.forEach((preTag) => {
          const jsonContent = preTag.textContent.trim();
          if (jsonContent) {
            try {
              const parsedJson = JSON.parse(jsonContent);
              if (Array.isArray(parsedJson)) {
                const jsonTextArea = document.getElementById("jsonText");
                if (jsonTextArea) {
                  jsonTextArea.value = jsonContent;
                  jsonTextArea.dispatchEvent(new Event("input"));
                  FileDownloaderCache.saveState();
                }
              }
            } catch (error) {
              console.error("Error parsing pre tag content:", error);
            }
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Generic selector function
const createCustomSelector = (
  inputSelector,
  targetValue,
  buttonText,
  bgColor,
  hoverColor
) => {
  const selectValue = () => {
    const isDropdownOpen = () => {
      return document.querySelector(".q-menu.scroll") !== null;
    };

    const trySelect = (value, maxAttempts = 10) => {
      let attempts = 0;
      const attempt = () => {
        if (attempts >= maxAttempts) {
          console.log("Failed to select after", maxAttempts, "attempts");
          return;
        }
        const items = document.querySelectorAll(".q-item__label span");
        const targetItem = Array.from(items).find(
          (item) => item.textContent === value
        );
        if (targetItem && isDropdownOpen()) {
          targetItem.closest(".q-item").click();
        } else {
          attempts++;
          setTimeout(attempt, 100);
        }
      };
      attempt();
    };

    const input = document.querySelector(inputSelector);
    if (input) {
      const dropdownIcon = input
        .closest(".q-field")
        .querySelector(".q-select__dropdown-icon");
      if (dropdownIcon) {
        dropdownIcon.click();
        setTimeout(() => trySelect(targetValue), 100);
      }
    }
  };

  const button = document.createElement("button");
  button.textContent = buttonText;
  button.style.cssText = `
    padding: 12px 20px;
    color: white;
    border: none;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    background-color: ${bgColor};
  `;

  button.addEventListener(
    "mouseover",
    () => (button.style.backgroundColor = hoverColor)
  );
  button.addEventListener(
    "mouseout",
    () => (button.style.backgroundColor = bgColor)
  );
  button.addEventListener("click", selectValue);

  return button;
};

// Create all selector buttons
const buttons = [
  // Semester buttons
  createCustomSelector(
    'input[aria-label="Semester Registrasi"]',
    "GENAP 2023/2024",
    "GENAP 23/24",
    "#3b82f6",
    "#2563eb"
  ),
  createCustomSelector(
    'input[aria-label="Semester Registrasi"]',
    "GANJIL 2024/2025",
    "GANJIL 24/25",
    "#ef4444",
    "#dc2626"
  ),
  // Validation status button
  createCustomSelector(
    'input[aria-label="Status Validasi"]',
    "TELAH DIVALIDASI ADMIN",
    "VALIDATED",
    "#10b981",
    "#059669"
  ),
  // Recognition category button
  createCustomSelector(
    'input[aria-label="Kategori Rekognisi"]',
    "Conference/Seminar sebagai Pemakalah pada seminar Nasional",
    "CONFERENCE",
    "#8b5cf6",
    "#7c3aed"
  ),
];

// Add all buttons to container
buttons.forEach((button) => buttonContainer.appendChild(button));

// Create copy button
const copyButton = document.createElement("button");
copyButton.innerText = "Copy Script";
copyButton.style.cssText = `
  padding: 12px 20px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

// Add hover effects for copy button
copyButton.addEventListener("mouseover", () => {
  copyButton.style.background = "#4f46e5";
});
copyButton.addEventListener("mouseout", () => {
  copyButton.style.background = "#6366f1";
});

buttonContainer.appendChild(copyButton);

// Create and insert file downloader card
const createFileDownloader = () => {
  const fileDownloader = document.createElement("div");
  fileDownloader.id = "sispema-file-downloader";
  fileDownloader.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
  fileDownloader.innerHTML = `
    <div class="q-card bodi-content" style="margin-bottom: 16px; visibility: visible; opacity: 1;">
      <div class="q-card__section q-card__section--vert q-pa-sm">
        <div class="text-h6 q-mb-md">File Downloader</div>
        <div class="q-mb-md">
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
          <input type="text" id="jsonPrefixInput" placeholder="Enter prefix for all files (optional)" style="width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 0.875rem; margin-bottom: 12px;">
        </div>
        <div id="urlContainer" style="max-height: 300px; overflow-y: auto;"></div>
        <button id="downloadAllBtn" style="width: 100%; background: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer; transition: background 0.2s;" disabled>
          Download All
        </button>
      </div>
    </div>
  `;

  const insertFileDownloader = () => {
    const targetRow = document.querySelector(".row.q-col-gutter-sm");
    if (targetRow) {
      const existingDownloader = document.getElementById(
        "sispema-file-downloader"
      );
      if (existingDownloader) {
        existingDownloader.remove();
      }
      targetRow.insertBefore(fileDownloader, targetRow.firstChild);
    } else {
      setTimeout(insertFileDownloader, 500);
    }
  };

  insertFileDownloader();

  const mutationObserver = new MutationObserver((mutations) => {
    const targetRow = document.querySelector(".row.q-col-gutter-sm");
    if (targetRow && !document.getElementById("sispema-file-downloader")) {
      insertFileDownloader();
    }
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return fileDownloader;
};

// Initialize components
document.body.appendChild(buttonContainer);
const fileDownloader = createFileDownloader();

// Store URLs and file names
let currentFiles = [];

// Helper function for file extensions
function getFileExtension(contentType) {
  if (contentType.includes("pdf")) return ".pdf";
  if (contentType.includes("image")) return ".png";
  return ".bin";
}

// Download file function
async function downloadFile(file, prefix, progressCallback = null) {
  try {
    if (file.isBlob) {
      const response = await fetch(file.url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const contentType = response.headers.get("content-type");
      const ext = getFileExtension(contentType);
      const filename = prefix
        ? `${prefix}_${file.name}${ext}`
        : `${file.name}${ext}`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else {
      const blob = new Blob([file.url], { type: "text/plain" });
      const filename = prefix
        ? `${prefix}_${file.name}.txt`
        : `${file.name}.txt`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    if (progressCallback) progressCallback();
    return true;
  } catch (error) {
    console.error(`Download error for file: ${file.name}`, error);
    return false;
  }
}

// Update URL container function
function updateUrlContainer() {
  const urlContainer = document.getElementById("urlContainer");
  const prefix = document.getElementById("jsonPrefixInput").value.trim();

  urlContainer.innerHTML = "";
  currentFiles.forEach((file) => {
    const displayName = prefix ? `${prefix}_${file.name}` : file.name;

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = `Download ${displayName}`;
    downloadBtn.style.cssText = `
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

    downloadBtn.addEventListener("mouseover", () => {
      downloadBtn.style.background = "#e5e7eb";
    });
    downloadBtn.addEventListener("mouseout", () => {
      downloadBtn.style.background = "#f3f4f6";
    });

    downloadBtn.onclick = () => downloadFile(file, prefix);
    urlContainer.appendChild(downloadBtn);
  });

  document.getElementById("downloadAllBtn").disabled =
    currentFiles.length === 0;
  FileDownloaderCache.saveState();
}

// Copy script function
async function copySispema2() {
  try {
    const response = await fetch(chrome.runtime.getURL("sispema.js"));
    const text = await response.text();
    await navigator.clipboard.writeText(text);

    showPopup(`
      <div style="font-size: 18px; line-height: 1.6;">
        <p style="margin-bottom: 20px; color: #28a745;">✅ Kode berhasil disalin!</p>
        <p style="margin-bottom: 15px; color: #444;">Untuk menjalankan program, buka Console dengan cara:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; color: #555; text-align: left;">
          <tr>
            <td style="padding: 8px 15px 8px 0;"><strong>Chrome:</strong></td>
            <td style="padding: 8px 0;"><kbd style="background: #f8f9fa; padding: 2px 5px; border-radius: 3px;">Ctrl + Shift + J</kbd></td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 8px 0;"><strong>Edge:</strong></td>
            <td style="padding: 8px 0;"><kbd style="background: #f8f9fa; padding: 2px 5px; border-radius: 3px;">Ctrl + Shift + J</kbd></td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 8px 0;"><strong>Firefox:</strong></td>
            <td style="padding: 8px 0;"><kbd style="background: #f8f9fa; padding: 2px 5px; border-radius: 3px;">Ctrl + Shift + K</kbd></td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 8px 0;"><strong>Safari (Mac):</strong></td>
            <td style="padding: 8px 0;"><kbd style="background: #f8f9fa; padding: 2px 5px; border-radius: 3px;">Cmd + Option + C</kbd></td>
          </tr>
        </table>
        <p style="color: #666; font-size: 14px; margin-top: 15px;">Atau klik kanan → Inspect → pilih tab Console</p>
      </div>
    `);

    setTimeout(() => {
      console.log(
        "%c📝 PETUNJUK PENGGUNAAN",
        "color: #2ecc71; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.2); padding: 10px 0;"
      );

      console.log(
        "%c✨ Langkah 1: Salin (copy) kode yang ingin Anda gunakan",
        "color: #3498db; font-size: 18px; padding: 5px 0;"
      );

      console.log(
        "%c✨ Langkah 2: Tempel (paste) kode di sini dan tekan Enter",
        "color: #3498db; font-size: 18px; padding: 5px 0;"
      );

      console.log(
        "%c❓ Jika tidak bisa menempel kode:%c\n" +
          "1. Ketik %callow pasting%c di console ini\n" +
          "2. Tekan Enter\n" +
          "3. Coba tempel kode lagi",
        "color: #e74c3c; font-size: 18px; font-weight: bold;",
        "color: #e74c3c; font-size: 16px;",
        "color: #2980b9; font-size: 16px; font-weight: bold; background: #eee; padding: 2px 5px; border-radius: 3px;",
        "color: #e74c3c; font-size: 16px;"
      );

      console.debug(
        "%c🔧 Mempersiapkan DevTools...",
        "color: #7f8c8d; font-size: 14px; font-style: italic;"
      );
    }, 100);
  } catch (error) {
    console.error("Gagal menyalin teks:", error);
    showPopup("Gagal menyalin teks. Lihat console untuk detail.");
  }
}

// Show popup function
function showPopup(message) {
  let overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  let popup = document.createElement("div");
  popup.innerHTML = `
    <div class="popup-content" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.7);
      background: linear-gradient(145deg, #ffffff, #f0f0f0);
      padding: 30px 40px;
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      text-align: center;
      z-index: 9999;
      max-width: 500px;
      width: 90%;
      opacity: 0;
      transition: all 0.3s ease;
    ">
      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px; font-weight: 600;">
        Pemberitahuan
      </h2>
      <p style="margin: 0; font-size: 18px; line-height: 1.6; color: #555;">${message}</p>
      <button onclick="this.closest('.popup-content').parentElement.remove();
                      document.querySelector('.popup-overlay').remove();" 
              style="
                margin-top: 25px;
                padding: 12px 30px;
                border: none;
                background: linear-gradient(145deg, #007bff, #0056b3);
                color: white;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                border-radius: 10px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              "
              onmouseover="this.style.transform='scale(1.05)';
                          this.style.boxShadow='0 5px 15px rgba(0, 123, 255, 0.4)';"
              onmouseout="this.style.transform='scale(1)';
                         this.style.boxShadow='none';"
      >OK</button>
    </div>
  `;

  overlay.classList.add("popup-overlay");
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  setTimeout(() => {
    overlay.style.opacity = "1";
    let popupContent = popup.querySelector(".popup-content");
    popupContent.style.opacity = "1";
    popupContent.style.transform = "translate(-50%, -50%) scale(1)";
  }, 10);
}

// Initialize event handlers
document
  .getElementById("pasteJsonBtn")
  .addEventListener("click", async function () {
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById("jsonText").value = text;
      document.getElementById("jsonText").dispatchEvent(new Event("input"));
    } catch (err) {
      alert(
        "Gagal mengambil teks dari clipboard. Pastikan Anda memberikan izin."
      );
      console.error(err);
    }
  });

// JSON text input handler
document.getElementById("jsonText").addEventListener("input", () => {
  try {
    const jsonData = JSON.parse(document.getElementById("jsonText").value);
    if (Array.isArray(jsonData)) {
      currentFiles = jsonData.map((item) => ({
        url: item.url,
        name: item.name,
        isBlob: item.url.startsWith("blob:"),
      }));
      updateUrlContainer();
    }
  } catch (error) {
    currentFiles = [];
    document.getElementById("urlContainer").innerHTML = "";
    document.getElementById("downloadAllBtn").disabled = true;
  }
});

// Download all files handler
document
  .getElementById("downloadAllBtn")
  .addEventListener("click", async () => {
    if (currentFiles.length === 0) {
      alert("No files to download");
      return;
    }

    const downloadAllBtn = document.getElementById("downloadAllBtn");
    const prefix = document.getElementById("jsonPrefixInput").value.trim();

    downloadAllBtn.disabled = true;
    let successCount = 0;
    const totalFiles = currentFiles.length;

    for (let i = 0; i < currentFiles.length; i++) {
      const file = currentFiles[i];
      downloadAllBtn.textContent = `Downloading ${i + 1}/${totalFiles}...`;

      const success = await downloadFile(file, prefix, () => {
        successCount++;
      });

      if (i < currentFiles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    downloadAllBtn.textContent = "Download All";
    downloadAllBtn.disabled = false;

    if (successCount < totalFiles) {
      alert(
        `Downloaded ${successCount} out of ${totalFiles} files. Some files may have failed.`
      );
    }
  });

// Copy script button event listener
copyButton.addEventListener("click", copySispema2);

// Initial setup after page load
document.addEventListener("DOMContentLoaded", () => {
  FileDownloaderCache.restoreState();
  setupAutoPasteObserver();
});
