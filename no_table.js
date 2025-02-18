// Function to wait for table to be available
async function waitForTable() {
  return new Promise((resolve) => {
    const checkTable = () => {
      const table = document.querySelector(".q-table");
      if (table) {
        // Add extra delay to ensure table is fully loaded
        setTimeout(resolve, 1500);
      } else {
        setTimeout(checkTable, 100);
      }
    };
    checkTable();
  });
}

// Function to get current page info
function getPageInfo() {
  const paginationElement = document.querySelector(
    ".q-table__bottom-item:nth-child(2)"
  );

  if (!paginationElement) {
    console.warn("Pagination element not found, using default values");
    return {
      currentPage: 1,
      rowsPerPage: 15,
      total: 0,
    };
  }

  const paginationText = paginationElement.textContent;
  const matches = paginationText.match(/(\d+)-(\d+) of (\d+)/);

  if (!matches) {
    console.warn("Unable to parse pagination text, using default values");
    return {
      currentPage: 1,
      rowsPerPage: 15,
      total: 0,
    };
  }

  const start = parseInt(matches[1]);
  const end = parseInt(matches[2]);
  const total = parseInt(matches[3]);
  const rowsPerPage = end - start + 1;
  const currentPage = Math.ceil(start / rowsPerPage);

  return {
    currentPage,
    rowsPerPage,
    total,
  };
}

// Function to add number column to table
async function addNumberColumn() {
  try {
    await waitForTable();

    // Get the table header and body
    const tableHeader = document.querySelector(".q-table thead tr");
    const tableRows = document.querySelectorAll(".q-table tbody tr");

    if (!tableHeader || !tableRows.length) {
      console.warn("Table elements not found");
      return;
    }

    // Check for existing "NO" column to avoid duplication
    const noColumnExists = Array.from(tableHeader.querySelectorAll("th")).some(
      (th) => th.textContent.trim() === "NO"
    );

    // Add number column header if it doesn't exist
    if (!noColumnExists) {
      const numberHeader = document.createElement("th");
      numberHeader.className = "text-left";
      numberHeader.style.width = "70px";
      numberHeader.textContent = "NO";
      tableHeader.insertBefore(numberHeader, tableHeader.firstChild);
    }

    // Get current page info for numbering
    const { currentPage, rowsPerPage } = getPageInfo();
    let startNumber = (currentPage - 1) * rowsPerPage + 1;

    // Add or update numbers for each row
    tableRows.forEach((row) => {
      // Check if number cell already exists
      let numberCell = row.querySelector("td.row-number-cell");

      if (!numberCell) {
        // Create new number cell
        numberCell = document.createElement("td");
        numberCell.className = "q-td text-left row-number-cell";
        numberCell.style.width = "70px";
        row.insertBefore(numberCell, row.firstChild);
      }

      // Update number
      numberCell.textContent = startNumber++;
    });
  } catch (error) {
    console.error("Error adding row numbers:", error);
  }
}

// Function to handle any table changes
async function handleTableChange() {
  await addNumberColumn();
}

// Function to observe table changes
function observeTableChanges() {
  const tableContainer = document.querySelector(".q-table");
  if (!tableContainer) return;

  // Create observer for the table body
  const bodyObserver = new MutationObserver(() => {
    handleTableChange();
  });

  // Observe table body changes
  const tableBody = tableContainer.querySelector("tbody");
  if (tableBody) {
    bodyObserver.observe(tableBody, {
      childList: true,
      subtree: true,
    });
  }

  // Create observer for pagination changes
  const paginationContainer = document.querySelector(".q-table__bottom");
  if (paginationContainer) {
    const paginationObserver = new MutationObserver(() => {
      handleTableChange();
    });

    paginationObserver.observe(paginationContainer, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}

// Function to handle pagination changes
async function handlePaginationChange() {
  await handleTableChange();
}

// Function to initialize the numbering system
async function initializeNumbering() {
  // Initial addition of numbers
  await addNumberColumn();

  // Add event listeners for pagination buttons
  document.querySelectorAll(".q-table__bottom button").forEach((button) => {
    button.removeEventListener("click", handlePaginationChange);
    button.addEventListener("click", handlePaginationChange);
  });

  // Add event listener for rows per page selector
  const rowsPerPageSelect = document.querySelector(".q-field__native");
  if (rowsPerPageSelect) {
    rowsPerPageSelect.removeEventListener("change", handlePaginationChange);
    rowsPerPageSelect.addEventListener("change", handlePaginationChange);
  }

  // Set up observers
  observeTableChanges();
}

// Function to handle page visibility changes
function handleVisibilityChange() {
  if (!document.hidden) {
    handleTableChange();
  }
}

// Initial setup with retry mechanism and continuous monitoring
async function setupWithRetry(maxRetries = 5, currentTry = 1) {
  try {
    await initializeNumbering();

    // Add visibility change listener for tab switches/refreshes
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add reload listener
    window.removeEventListener("load", handleTableChange);
    window.addEventListener("load", handleTableChange);

    // Set up periodic check (every 5 seconds) as a fallback
    setInterval(handleTableChange, 1000);

    console.log("Row numbering system initialized successfully");
  } catch (error) {
    if (currentTry < maxRetries) {
      console.log(`Retry attempt ${currentTry} of ${maxRetries}...`);
      setTimeout(() => setupWithRetry(maxRetries, currentTry + 1), 1000);
    } else {
      console.error("Failed to initialize row numbering after maximum retries");
    }
  }
}

// Make the setup process run continuously
function ensureContinuousOperation() {
  setupWithRetry();

  // Restart the setup if the script stops running for any reason
  setInterval(() => {
    const table = document.querySelector(".q-table");
    const numberColumn = Array.from(table?.querySelectorAll("th") || []).find(
      (th) => th.textContent.trim() === "NO"
    );

    if (table && !numberColumn) {
      console.log("Restarting numbering system...");
      setupWithRetry();
    }
  }, 10000);
}

// Start the continuous operation
ensureContinuousOperation();
