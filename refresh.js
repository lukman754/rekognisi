// Prevent page refresh and warn about data extractor popup
window.addEventListener("beforeunload", function (e) {
  e.preventDefault(); // Cancel the event
  e.returnValue = ""; // Chrome requires this to show the dialog

  // Custom alert with detailed warning
  const confirmMessage = `⚠️ PERINGATAN: Popup Data Extractor Akan Hilang!

Jika Anda me-refresh halaman, popup data extractor akan hilang dan Anda harus menjalankan ulang script di console.

Yakin ingin me-refresh halaman?`;

  return confirmMessage;
});

console.log(
  "Refresh warning script activated. Page refresh will now trigger a warning."
);
