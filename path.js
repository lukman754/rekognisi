// Path Manager Script - With Enhanced Multi-word Search Feature
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

  console.log(
    "Initializing Path Manager with Enhanced Multi-word Search Feature..."
  );

  const pathManagerHTML = `
  <div class="path-manager-container card">
    <div class="card-header">
      <h5 class="m-0">Surat Tugas</h5>
    </div>
    <div class="card-body">
      <div class="row mb-2">
        <div class="col-12">
          <div class="input-group">
            <input type="text" class="form-control search-input" placeholder="Search multiple words..." aria-label="Search">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary clear-search-btn" type="button">×</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-group mb-3">
        <textarea class="form-control path-value" placeholder="Paste path(s) here (one per line)" rows="3"></textarea>
        <div class="input-group-append">
          <button class="btn btn-primary add-path-btn">+</button>
        </div>
      </div>
      
      <div class="path-list-container">
        <ul class="list-group path-list"></ul>
      </div>
    </div>
    
    <!-- Hidden textarea for fallback copy method -->
    <textarea id="copy-fallback" style="position: fixed; top: -9999px; left: -9999px;"></textarea>
  </div>
  `;

  // Change the target element to place it above upload_dosen_karya
  const targetElement = document.getElementById("upload_dosen_karya");

  if (!targetElement) {
    console.error(
      "Target upload_dosen_karya element not found. Trying alternative..."
    );
    const altTarget = document.querySelector(
      ".form-group.form-float .col-sm-12.form-line"
    );

    if (!altTarget) {
      console.error(
        "Alternative target element not found. Waiting for 1 more second..."
      );
      await delay(1000);

      const retryTarget = document.querySelector(
        ".form-group.form-float .col-sm-12.form-line"
      );

      if (!retryTarget) {
        console.error("Target element still not found after retry. Aborting.");
        return;
      } else {
        console.log("Alternative target element found after retry!");
        retryTarget.insertAdjacentHTML("afterend", pathManagerHTML);
      }
    } else {
      console.log("Alternative target element found!");
      altTarget.insertAdjacentHTML("afterend", pathManagerHTML);
    }
  } else {
    console.log("Target upload_dosen_karya element found!");
    targetElement.insertAdjacentHTML("beforebegin", pathManagerHTML);
  }

  // Add custom styles with scrollable path list
  const styles = document.createElement("style");
  styles.textContent = `
    .path-manager-container {
      margin-top: 15px;
      margin-bottom: 15px;
      z-index: 999999999;
    }
    .path-list-container {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
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
    }
    .toast-notification.show {
      opacity: 1;
    }
    .path-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .path-filename {
      flex-grow: 1;
      margin-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .path-filename:hover {
      text-decoration: underline;
      color: #007bff;
    }
    .path-actions {
      white-space: nowrap;
    }
    .clear-search-btn {
      font-size: 1.5rem;
      line-height: 1;
      padding: 0.1rem 0.5rem;
    }
    .highlight {
      background-color: #ffff99;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styles);

  // State management
  let paths = [];
  const STORAGE_KEY = "savedPaths";
  let searchTerms = [];

  // Helper function to extract metadata from path
  function extractMetadata(path) {
    try {
      // Get filename from path (handle both / and \ path separators)
      const filename = path.split(/[/\\]/).pop();

      // Extract program and month using regex
      // This pattern looks for text before and within parentheses
      const pattern = /(.+?)\s*\(\s*([^)]+)\s*\)/i;
      const match = filename.match(pattern);

      if (match && match.length >= 3) {
        const program = match[1].trim();
        const month = match[2].trim();

        return {
          program,
          month,
          filename: filename,
        };
      }

      return {
        program: "Unknown",
        month: "Unknown",
        filename: filename || path,
      };
    } catch (err) {
      console.error("Error extracting metadata:", err);
      return {
        program: "Unknown",
        month: "Unknown",
        filename: path,
      };
    }
  }

  // Load saved paths from localStorage
  function loadSavedPaths() {
    const savedPaths = localStorage.getItem(STORAGE_KEY);
    if (savedPaths) {
      try {
        paths = JSON.parse(savedPaths);

        // Process and ensure all paths have metadata
        paths = paths.map((path) => {
          // If path is a string, convert to object format
          if (typeof path === "string") {
            return {
              path,
              id: Date.now(),
              ...extractMetadata(path),
            };
          }
          // If path is object but no metadata, add it
          else if (!path.program || !path.month) {
            return {
              ...path,
              ...extractMetadata(path.path),
            };
          }
          return path;
        });

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
        // Extract metadata before adding
        const metadata = extractMetadata(cleanedPath);

        paths.push({
          path: cleanedPath,
          id: Date.now() + addedCount,
          ...metadata,
        });

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

  // Delete path
  function deletePath(id) {
    paths = paths.filter((item) => item.id !== id);
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

  // Enhanced Search function for multiple words
  function searchPaths() {
    const searchInput = document
      .querySelector(".search-input")
      .value.trim()
      .toLowerCase();

    // Split search input by spaces to get individual search terms
    searchTerms = searchInput.split(/\s+/).filter((term) => term.length > 0);

    renderPaths();
  }

  // Clear search
  function clearSearch() {
    document.querySelector(".search-input").value = "";
    searchTerms = [];
    renderPaths();
  }

  // Helper function to highlight search terms in text
  function highlightSearchTerms(text, terms) {
    if (!terms.length) return text;

    let highlightedText = text;

    // Sort terms by length (longest first) to avoid highlighting issues
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);

    for (const term of sortedTerms) {
      // Escape special characters in the search term
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Create a regex with the escaped term
      const regex = new RegExp(`(${escapedTerm})`, "gi");

      // Replace matches with highlighted version
      highlightedText = highlightedText.replace(
        regex,
        '<span class="highlight">$1</span>'
      );
    }

    return highlightedText;
  }

  // Render paths list
  function renderPaths() {
    const listElement = document.querySelector(".path-list");
    if (!listElement) {
      console.error("Path list element not found");
      return;
    }

    listElement.innerHTML = "";

    // Apply search filter with multi-word capability
    let filteredPaths = paths;

    if (searchTerms.length > 0) {
      filteredPaths = filteredPaths.filter((item) => {
        // Search in filename, program, month and full path
        const filename = (item.filename || "").toLowerCase();
        const program = (item.program || "").toLowerCase();
        const month = (item.month || "").toLowerCase();
        const fullPath = (item.path || "").toLowerCase();

        // Concatenate all searchable text
        const searchableText = `${filename} ${program} ${month} ${fullPath}`;

        // Check if ALL search terms are found in the searchable text
        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    if (filteredPaths.length === 0) {
      const message =
        paths.length === 0
          ? "Belum ada path yang disimpan"
          : "Tidak ada path yang sesuai dengan pencarian";

      listElement.innerHTML = `<li class="list-group-item text-center text-muted">${message}</li>`;
      return;
    }

    filteredPaths.forEach((item) => {
      const li = document.createElement("li");
      li.className = "list-group-item path-item";
      li.dataset.id = item.id;

      // Extract just the filename for display
      const filename = item.filename || item.path.split(/[/\\]/).pop();

      // Highlight search terms if present
      const highlightedFilename =
        searchTerms.length > 0
          ? highlightSearchTerms(filename, searchTerms)
          : filename;

      li.innerHTML = `
        <div class="path-filename" title="${item.path}">${highlightedFilename}</div>
        <div class="path-actions">
          <button class="btn btn-sm btn-outline-primary mr-1" title="Salin Path">Copy</button>
          <button class="btn btn-sm btn-outline-danger" title="Hapus">X</button>
        </div>
      `;

      listElement.appendChild(li);

      // Add click event to filename to copy path
      li.querySelector(".path-filename").addEventListener("click", () => {
        copyPath(item.path);
      });

      // Add click event to copy button
      li.querySelector(".btn-outline-primary").addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          copyPath(item.path);

          // Change button text temporarily
          const copyBtn = e.target.closest(".btn-outline-primary");
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "✓";
          copyBtn.classList.remove("btn-outline-primary");
          copyBtn.classList.add("btn-success");

          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove("btn-success");
            copyBtn.classList.add("btn-outline-primary");
          }, 1000);
        }
      );

      // Delete button event
      li.querySelector(".btn-outline-danger").addEventListener("click", () => {
        deletePath(item.id);
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

  // Set up search events
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", searchPaths);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        clearSearch();
      }
    });

    // Add placeholder hint for multi-word search
    searchInput.setAttribute("placeholder", "Ketik beberapa kata kunci...");
  }

  // Set up clear search button
  const clearSearchBtn = document.querySelector(".clear-search-btn");
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", clearSearch);
  }

  // Load saved paths
  console.log("Loading saved paths...");
  loadSavedPaths();

  console.log(
    "Path Manager with Enhanced Multi-word Search initialized successfully!"
  );
})();
