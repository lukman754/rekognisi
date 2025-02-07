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

// Function untuk semester selector
const createSemesterSelector = () => {
  const isDropdownOpen = () => {
    return document.querySelector(".q-menu.scroll") !== null;
  };

  const trySelectSemester = (semester, maxAttempts = 10) => {
    let attempts = 0;
    const attempt = () => {
      if (attempts >= maxAttempts) {
        console.log("Gagal memilih semester setelah", maxAttempts, "percobaan");
        return;
      }
      const items = document.querySelectorAll(".q-item__label span");
      const targetItem = Array.from(items).find(
        (item) => item.textContent === semester
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

  const pilihSemesterLengkap = (semester) => {
    const semesterInput = document.querySelector(
      'input[aria-label="Semester Registrasi"]'
    );
    if (semesterInput) {
      const dropdownIcon = semesterInput
        .closest(".q-field")
        .querySelector(".q-select__dropdown-icon");
      if (dropdownIcon) {
        dropdownIcon.click();
        setTimeout(() => trySelectSemester(semester), 100);
      }
    }
  };

  const baseStyle = `
    padding: 12px 20px;
    color: white;
    border: none;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

  const buttonGenap = document.createElement("button");
  buttonGenap.textContent = "GENAP 23/24";
  buttonGenap.style.cssText = baseStyle;
  buttonGenap.style.backgroundColor = "#3b82f6";
  buttonGenap.addEventListener(
    "mouseover",
    () => (buttonGenap.style.backgroundColor = "#2563eb")
  );
  buttonGenap.addEventListener(
    "mouseout",
    () => (buttonGenap.style.backgroundColor = "#3b82f6")
  );
  buttonGenap.addEventListener("click", () =>
    pilihSemesterLengkap("GENAP 2023/2024")
  );

  const buttonGanjil = document.createElement("button");
  buttonGanjil.textContent = "GANJIL 24/25";
  buttonGanjil.style.cssText = baseStyle;
  buttonGanjil.style.backgroundColor = "#ef4444";
  buttonGanjil.addEventListener(
    "mouseover",
    () => (buttonGanjil.style.backgroundColor = "#dc2626")
  );
  buttonGanjil.addEventListener(
    "mouseout",
    () => (buttonGanjil.style.backgroundColor = "#ef4444")
  );
  buttonGanjil.addEventListener("click", () =>
    pilihSemesterLengkap("GANJIL 2024/2025")
  );

  return [buttonGenap, buttonGanjil];
};

// Create copy button
const copyButton = document.createElement("button");
copyButton.innerText = "Copy sispema.js";
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

// Create and insert file downloader card
// Modified file downloader creation and insertion
const createFileDownloader = () => {
  const fileDownloader = document.createElement("div");
  fileDownloader.id = "sispema-file-downloader"; // Add unique identifier
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

  // Enhanced insertion logic
  const insertFileDownloader = () => {
    const targetRow = document.querySelector(".row.q-col-gutter-sm");
    if (targetRow) {
      // Remove any existing downloader first
      const existingDownloader = document.getElementById(
        "sispema-file-downloader"
      );
      if (existingDownloader) {
        existingDownloader.remove();
      }

      // Insert new downloader
      targetRow.insertBefore(fileDownloader, targetRow.firstChild);
    } else {
      // Retry insertion after a short delay if row not found
      setTimeout(insertFileDownloader, 500);
    }
  };

  // Initial and repeated insertion attempts
  insertFileDownloader();

  // Additional fallback mechanism
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

// Modify initialization to ensure robust insertion
function initializeFileDownloader() {
  const existingDownloader = document.getElementById("sispema-file-downloader");
  if (!existingDownloader) {
    createFileDownloader();
  }
}

// Multiple insertion attempts
document.addEventListener("DOMContentLoaded", initializeFileDownloader);
window.addEventListener("load", initializeFileDownloader);

// Periodic check for insertion
setInterval(initializeFileDownloader, 1000);

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

  // Save state after update
  FileDownloaderCache.saveState();
}

// Copy sispema.js function
async function copySispema2() {
  try {
    const response = await fetch(chrome.runtime.getURL("sispema.js"));
    const text = await response.text();

    await navigator.clipboard.writeText(text);
    alert(
      "Script sispema.js telah disalin ke clipboard! Buka console (CTRL+SHIFT+J) untuk menjalankan program."
    );

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

// Initialize the components
document.body.appendChild(buttonContainer);
const semesterButtons = createSemesterSelector();
semesterButtons.forEach((button) => buttonContainer.appendChild(button));
buttonContainer.appendChild(copyButton);
const fileDownloader = createFileDownloader();

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
// Download all files handler (continued)
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

// Copy sispema.js button event listener
copyButton.addEventListener("click", copySispema2);

// Initial setup after page load
document.addEventListener("DOMContentLoaded", () => {
  // Restore cached state
  FileDownloaderCache.restoreState();

  // Setup auto-paste observer
  setupAutoPasteObserver();
});

