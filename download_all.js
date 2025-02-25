// Function to simulate button clicks
function simulateClick(element) {
  if (element) {
    element.click();
  }
}

// Function to handle the copy, paste and download process
function handleCopyPasteAndDownload() {
  const preElement = document.querySelector("pre");
  const copyJsonBtn = document.querySelector('button:contains("Copy JSON")');
  const pasteJsonBtn = document.getElementById("pasteJsonBtn");
  const downloadAllBtn = document.getElementById("downloadAllBtn");
  const textareaElement = document.getElementById("jsonText");

  if (preElement && preElement.textContent.trim()) {
    // First click Copy JSON button
    setTimeout(() => {
      simulateClick(copyJsonBtn);

      // Then click Paste JSON button after a small delay
      setTimeout(() => {
        simulateClick(pasteJsonBtn);

        // Also set the content directly to ensure it works
        if (textareaElement) {
          textareaElement.value = preElement.textContent;

          // Trigger change event
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          textareaElement.dispatchEvent(event);

          // Wait a moment for any validation/processing to complete
          setTimeout(() => {
            // Enable the Download All button if it's disabled
            if (downloadAllBtn) {
              downloadAllBtn.disabled = false;
            }

            // Click Download All button
            simulateClick(downloadAllBtn);
          }, 500); // 500ms delay before download
        }
      }, 100); // 100ms delay before paste
    }, 100); // 100ms delay before copy
  }
}

// Extend jQuery-like contains selector for buttons
document.querySelector = (function (native) {
  return function (selector) {
    if (selector.includes(":contains(")) {
      const text = selector.match(/:contains\("(.+?)"\)/)[1];
      const elements = document.getElementsByTagName("button");
      for (let element of elements) {
        if (element.textContent.includes(text)) {
          return element;
        }
      }
      return null;
    }
    return native.call(document, selector);
  };
})(document.querySelector);

// Create a MutationObserver instance
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" || mutation.type === "characterData") {
      handleCopyPasteAndDownload();
    }
  });
});

// Start observing the pre element
const preElement = document.querySelector("pre");
if (preElement) {
  observer.observe(preElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });

  // Initial process when script loads
  if (preElement.textContent.trim()) {
    handleCopyPasteAndDownload();
  }
}
