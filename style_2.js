// Function to apply enhanced styling to the table
function enhanceTableStyle() {
  // Get the table element
  const table = document.querySelector("table");
  if (!table) return;

  // Add required CSS
  if (!document.querySelector("[data-bootstrap]")) {
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href =
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
    bootstrapCSS.setAttribute("data-bootstrap", "true");
    document.head.appendChild(bootstrapCSS);
  }

  // Add DataTables CSS
  if (!document.querySelector("[data-datatables-css]")) {
    const dataTablesCSS = document.createElement("link");
    dataTablesCSS.rel = "stylesheet";
    dataTablesCSS.href =
      "https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css";
    dataTablesCSS.setAttribute("data-datatables-css", "true");
    document.head.appendChild(dataTablesCSS);
  }

  // Add required scripts
  function loadScript(url, attribute, callback) {
    if (!document.querySelector(`[${attribute}]`)) {
      const script = document.createElement("script");
      script.src = url;
      script.setAttribute(attribute, "true");
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      callback();
    }
  }

  // Add custom styles
  const style = document.createElement("style");
  style.textContent = `
        .dataTables_wrapper {
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        table {
            margin-bottom: 1rem;
            background-color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            table-layout: fixed;
        }

        table thead th {
            background-color: #2c3e50 !important;
            color: white !important;
            font-weight: 600;
            padding: 12px !important;
            border: none !important;
            font-size: 14px;
        }

        table tbody td {
            padding: 12px !important;
            vertical-align: middle;
            border-bottom: 1px solid #eee !important;
            color: #333;
            font-size: 14px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        table tbody tr:hover {
            background-color: #f8f9fa;
        }

        
        /* Download button styling */
        table a[href*="Download"],
        table a[href*="download"],
        table td:nth-child(6) a,
        table td:nth-child(8) a,
        table td:nth-child(9) a {
            display: inline-block;
            padding: 6px 12px;
            background-color: #4CAF50;
            color: white !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 13px;
            transition: background-color 0.2s;
            border: none;
            text-align: center;
            min-width: 90px;
            margin: 0 5px;
        }

        table a[href*="Download"]:hover,
        table a[href*="download"]:hover,
        table td:nth-child(6) a:hover,
        table td:nth-child(8) a:hover,
        table td:nth-child(9) a:hover {
            background-color: #45a049;
            text-decoration: none;
        }

        /* Action buttons container */
        table td:last-child {
            white-space: nowrap;
            text-align: center;
        }

        /* View button */
        table td:last-child a:first-child button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            margin: 2px;
            transition: background-color 0.2s;
        }

        /* Delete button */
        table td:last-child a:last-child button {
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            margin: 2px;
            transition: background-color 0.2s;
        }

        table td:last-child button:hover {
            opacity: 0.85;
        }

        table td:last-child i {
            color: white;
        }

        /* DataTables specific styling */
        .dataTables_filter input {
            padding: 6px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-left: 8px;
        }

        .dataTables_length select {
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin: 0 4px;
        }

        .dataTables_info {
            color: #666;
            padding-top: 15px !important;
        }

        .dataTables_paginate {
            padding-top: 15px !important;
        }

        .paginate_button {
            padding: 5px !important;
        }

        @media (max-width: 1200px) {
            .table-responsive {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            table td, table th {
                white-space: normal;
            }

            table {
                min-width: 1000px;
            }
        }
    `;

  // Apply the custom styles
  document.head.appendChild(style);

  // Load jQuery if not present, then load DataTables
  loadScript(
    "https://code.jquery.com/jquery-3.7.1.min.js",
    "data-jquery",
    function () {
      loadScript(
        "https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js",
        "data-datatables",
        function () {
          loadScript(
            "https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js",
            "data-datatables-bs5",
            function () {
              // Initialize DataTables
              $(table).DataTable({
                responsive: true,
                pageLength: 10,
                language: {
                  search: "Pencarian:",
                  lengthMenu: "Tampilkan _MENU_ data per halaman",
                  zeroRecords: "Data tidak ditemukan",
                  info: "Menampilkan halaman _PAGE_ dari _PAGES_",
                  infoEmpty: "Tidak ada data tersedia",
                  infoFiltered: "(difilter dari _MAX_ total data)",
                  paginate: {
                    first: "Pertama",
                    last: "Terakhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya",
                  },
                },
              });
            }
          );
        }
      );
    }
  );

  // Update all download links to have consistent styling
  const downloadLinks = table.querySelectorAll(
    'a[href*="download"], a[href*="Download"]'
  );
  downloadLinks.forEach((link) => {
    if (!link.innerHTML.includes("Download")) {
      link.innerHTML = 'Download <i class="fa fa-download"></i>';
    }
  });

  console.log("Table styling and DataTables have been enhanced!");
}

// Execute the enhancement
enhanceTableStyle();
