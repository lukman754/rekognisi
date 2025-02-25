// Path Manager Script - Minimalist Version with Batch Input
(async function () {
  // Helper function for delay
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Wait for page to fully load and add 1 second delay
  await new Promise((resolve) => {
    if (document.readyState === "complete") {
      console.log("Page already loaded, adding delay...");
      setTimeout(resolve, 1000);
    } else {
      console.log("Waiting for page to load...");
      window.addEventListener("load", () => {
        console.log("Page loaded, adding delay...");
        setTimeout(resolve, 1000);
      });
    }
  });

  console.log("Initializing Path Manager with Batch Input...");

  const pathManagerHTML = `
  <div class="path-manager-container">
    <h5>Path Manager</h5>
    
    <div class="path-input-section">
      <div class="input-group input-group-sm mb-2">
        <textarea class="form-control path-value" placeholder="Paste path(s) here (one per line)"></textarea>
        <div class="input-group-append">
          <button class="btn btn-sm btn-primary add-path-btn">+</button>
        </div>
      </div>
    </div>
    
    <div class="path-list-container">
      <ul class="path-list list-group"></ul>
    </div>
    
    <!-- Hidden textarea for fallback copy method -->
    <textarea id="copy-fallback" style="position: fixed; top: -9999px; left: -9999px;"></textarea>
  </div>
  `;

  // Check if the target element exists
  const targetElement = document.querySelector(
    ".form-group.form-float .col-sm-12.file-upload"
  );
  if (!targetElement) {
    console.error("Target element not found. Waiting for 1 more second...");
    await delay(1000);

    const retryTarget = document.querySelector(
      ".form-group.form-float .col-sm-12.file-upload"
    );
    if (!retryTarget) {
      console.error("Target element still not found after retry. Aborting.");
      return;
    } else {
      console.log("Target element found after retry!");
      retryTarget.insertAdjacentHTML("beforebegin", pathManagerHTML);
    }
  } else {
    console.log("Target element found!");
    targetElement.insertAdjacentHTML("beforebegin", pathManagerHTML);
  }

  // Add some styles
  const styles = document.createElement("style");
  styles.textContent = `
    .path-manager-container {
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
      font-size: 0.9rem;
    }
    .path-list-container {
      margin-top: 10px;
    }
    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      padding: 5px 8px;
      font-size: 0.85rem;
    }
    .path-content {
      flex-grow: 1;
      margin-right: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 90px);
    }
    .path-actions {
      display: flex;
      gap: 2px;
    }
    .path-value-display {
      cursor: pointer;
      padding: 2px 5px;
      background-color: #f0f0f0;
      border-radius: 3px;
      word-break: break-all;
      position: relative;
    }
    .edit-mode input {
      margin-bottom: 4px;
      font-size: 0.85rem;
    }
    .btn-path {
      padding: 1px 5px;
      font-size: 0.75rem;
      min-width: 28px;
    }
    .toast-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 8px 15px;
      border-radius: 4px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 0.9rem;
    }
    .toast-notification.show {
      opacity: 1;
    }
    .path-value {
      min-height: 38px;
      max-height: 100px;
    }
  `;
  document.head.appendChild(styles);

  // State management
  let paths = [];
  const STORAGE_KEY = "savedPaths";

  // Load saved paths from localStorage
  function loadSavedPaths() {
    const savedPaths = localStorage.getItem(STORAGE_KEY);
    if (savedPaths) {
      try {
        paths = JSON.parse(savedPaths);
        // Remove titles from existing paths
        paths = paths.map((path) => ({
          path: path.path,
          id: path.id || Date.now(),
        }));
        renderPaths();
      } catch (err) {
        console.error("Error parsing saved paths:", err);
        localStorage.removeItem(STORAGE_KEY);
        paths = [];
      }
    }
  }

  // Save paths to localStorage
  function savePaths() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
  }

  // Process batch input
  function processBatchInput(inputText) {
    if (!inputText.trim()) return;

    // Split by new lines
    const lines = inputText.split("\n");

    let addedCount = 0;

    // Process each line
    lines.forEach((line) => {
      // Skip empty lines
      if (!line.trim()) return;

      // Remove quotes if present
      const cleanedPath = line.trim().replace(/^"(.*)"$/, "$1");

      if (cleanedPath) {
        paths.push({ path: cleanedPath, id: Date.now() + addedCount });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      savePaths();
      renderPaths();
      document.querySelector(".path-value").value = "";
      showToast(`${addedCount} path ditambahkan`);
    }
  }

  // Add single path
  function addPath(path) {
    if (!path) return;

    // Check if it might be a batch input
    if (
      path.includes("\n") ||
      (path.includes('"') && path.trim().startsWith('"'))
    ) {
      processBatchInput(path);
      return;
    }

    // Single path case
    paths.push({ path, id: Date.now() });
    savePaths();
    renderPaths();
    document.querySelector(".path-value").value = "";
  }

  // Delete path
  function deletePath(id) {
    paths = paths.filter((item) => item.id !== id);
    savePaths();
    renderPaths();
  }

  // Update path
  function updatePath(id, path) {
    paths = paths.map((item) => {
      if (item.id === id) {
        return { ...item, path };
      }
      return item;
    });
    savePaths();
    renderPaths();
  }

  // Show toast notification
  function showToast(message, duration = 2000) {
    // Remove any existing toast
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast with a small delay to trigger transition
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Hide toast after duration
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300); // Wait for fade out transition
    }, duration);
  }

  // Copy path to clipboard with fallback
  function copyPath(path) {
    // Try to use the modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(path)
        .then(() => {
          showToast("Path disalin!");
        })
        .catch((err) => {
          console.warn("Clipboard API failed, using fallback method.", err);
          fallbackCopy(path);
        });
    } else {
      // Use fallback method if Clipboard API is not supported
      fallbackCopy(path);
    }
  }

  // Fallback copy method using textarea
  function fallbackCopy(text) {
    try {
      // Get the hidden textarea
      const textarea = document.getElementById("copy-fallback");

      // Set its value to the text to copy
      textarea.value = text;

      // Make it visible but stay off-screen
      textarea.style.display = "block";

      // Select all the text
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For mobile devices

      // Execute copy command
      const successful = document.execCommand("copy");

      // Hide the textarea again
      textarea.style.display = "none";

      if (successful) {
        showToast("Path disalin!");
      } else {
        console.error("execCommand copy failed");
        showManualCopyPrompt(text);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showManualCopyPrompt(text);
    }
  }

  // Show prompt for manual copy
  function showManualCopyPrompt(text) {
    alert(
      `Tidak dapat menyalin secara otomatis. Silakan salin teks ini secara manual:\n\n${text}`
    );
  }

  // Render paths list
  function renderPaths() {
    const listElement = document.querySelector(".path-list");
    if (!listElement) {
      console.error("Path list element not found");
      return;
    }

    listElement.innerHTML = "";

    if (paths.length === 0) {
      listElement.innerHTML =
        '<li class="list-group-item text-center text-muted py-1" style="font-size: 0.8rem;">Belum ada path yang disimpan</li>';
      return;
    }

    paths.forEach((item) => {
      const li = document.createElement("li");
      li.className = "path-item list-group-item py-1 px-2";
      li.dataset.id = item.id;

      li.innerHTML = `
        <div class="path-content">
          <div class="path-value-display" title="Klik untuk menyalin">${item.path}</div>
        </div>
        <div class="path-actions">
          <button class="btn btn-sm btn-info btn-path" title="Salin">Copy</button>
          <button class="btn btn-sm btn-warning btn-path" title="Edit">Edit</button>
          <button class="btn btn-sm btn-danger btn-path" title="Hapus">X</button>
        </div>
      `;

      listElement.appendChild(li);

      // Add click event to copy path (on the display element)
      li.querySelector(".path-value-display").addEventListener("click", () => {
        copyPath(item.path);
      });

      // Add click event to copy button
      li.querySelector(".btn-info").addEventListener("click", (e) => {
        e.stopPropagation();
        copyPath(item.path);

        // Change button text temporarily
        const copyBtn = e.target.closest(".btn-info");
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓";
        copyBtn.classList.remove("btn-info");
        copyBtn.classList.add("btn-success");

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove("btn-success");
          copyBtn.classList.add("btn-info");
        }, 2000);
      });

      // Delete button event
      li.querySelector(".btn-danger").addEventListener("click", () => {
        deletePath(item.id);
      });

      // Edit button event
      li.querySelector(".btn-warning").addEventListener("click", function () {
        const pathItem = this.closest(".path-item");
        const pathContent = pathItem.querySelector(".path-content");
        const currentPath = item.path;

        pathContent.innerHTML = `
          <div class="edit-mode">
            <input type="text" class="form-control form-control-sm edit-path" value="${currentPath}" placeholder="Path URL/Location">
            <div class="mt-1">
              <button class="btn btn-sm btn-success btn-path save-edit-btn">✓</button>
              <button class="btn btn-sm btn-secondary btn-path cancel-edit-btn">×</button>
            </div>
          </div>
        `;

        // Save button event
        pathContent
          .querySelector(".save-edit-btn")
          .addEventListener("click", () => {
            const newPath = pathContent.querySelector(".edit-path").value;

            if (newPath) {
              updatePath(item.id, newPath);
            }
          });

        // Cancel button event
        pathContent
          .querySelector(".cancel-edit-btn")
          .addEventListener("click", () => {
            renderPaths();
          });
      });
    });
  }

  // Initialize events after everything is loaded
  await delay(1000); // Additional 1 second delay for safety
  console.log("Setting up event listeners...");

  // Add path button event
  const addPathBtn = document.querySelector(".add-path-btn");
  if (addPathBtn) {
    addPathBtn.addEventListener("click", () => {
      const pathInput = document.querySelector(".path-value").value;
      processBatchInput(pathInput);
    });
  }

  // Add path on Enter key in path input
  const pathValueInput = document.querySelector(".path-value");
  if (pathValueInput) {
    pathValueInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const pathInput = document.querySelector(".path-value").value;
        processBatchInput(pathInput);
      }
    });
  }

  // Auto-expand textarea as needed
  pathValueInput.addEventListener("input", function () {
    this.style.height = "auto";
    const maxHeight = 100; // Maximum height in pixels
    const scrollHeight = this.scrollHeight;
    this.style.height = Math.min(scrollHeight, maxHeight) + "px";
  });

  // Load saved paths
  console.log("Loading saved paths...");
  loadSavedPaths();

  console.log("Path Manager with Batch Input initialized successfully!");
})();
