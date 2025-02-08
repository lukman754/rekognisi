// Function to fetch and process data_dosen.json
async function replaceDosenIds() {
  try {
    // Fetch the JSON file
    const response = await fetch(chrome.runtime.getURL("data_dosen.json"));
    const jsonData = await response.json();

    // Create a map of names to NIDN for faster lookup
    const dosenMap = new Map(
      jsonData.data.map((dosen) => [dosen.name.toUpperCase(), dosen.nidn])
    );

    // Get the table using specific selector
    const tables = document.querySelectorAll(".q-table__middle .q-table");

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");

      // Process each row
      rows.forEach((row) => {
        const idCell = row.querySelector("td:first-child");
        const nameCell = row.querySelector("td:nth-child(2)");

        if (idCell && nameCell) {
          const dosenName = nameCell.textContent.trim().toUpperCase();
          const nidn = dosenMap.get(dosenName);

          if (nidn) {
            idCell.textContent = nidn;
          }
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to wait for element
function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Execute when the table is loaded
waitForElement(".q-table__middle .q-table").then(replaceDosenIds);

// Handle dynamic updates with debouncing
let timeout;
const observer = new MutationObserver(() => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (document.querySelector(".q-table__middle .q-table")) {
      replaceDosenIds();
    }
  }, 500);
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Run on initial page load if table exists
if (document.readyState !== "loading") {
  replaceDosenIds();
}
