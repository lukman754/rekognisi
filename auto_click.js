// Fungsi untuk mengklik tombol-tombol setelah halaman dimuat atau delay tertentu
function clickButtonsAfterLoad() {
  return new Promise((resolve) => {
    // Menunggu hingga semua tombol tersedia di DOM atau timeout setelah 1,5 detik
    const timeoutMs = 1500; // 1,5 detik
    let buttonsReady = false;

    // Cek apakah semua tombol sudah ada
    function checkButtonsExist() {
      const ganjilButton = document.querySelector(
        'button[style*="background-color: rgb(239, 68, 68)"]'
      );
      const validatedButton = document.querySelector(
        'button[style*="background-color: rgb(16, 185, 129)"]'
      );
      const conferenceButton = document.querySelector(
        'button[style*="background-color: rgb(139, 92, 246)"]'
      );

      return ganjilButton && validatedButton && conferenceButton;
    }

    // Fungsi untuk mengklik tombol dengan delay
    function clickButtons() {
      console.log("Preparing to click buttons with 700ms delays...");

      // Delay 700ms sebelum mengklik tombol pertama
      setTimeout(() => {
        // Tombol GANJIL 24/25
        const ganjilButton = document.querySelector(
          'button[style*="background-color: rgb(239, 68, 68)"]'
        );
        if (ganjilButton) {
          ganjilButton.click();
          console.log("Clicked GANJIL 24/25 button");
        } else {
          console.log("GANJIL 24/25 button not found");
        }

        // Delay 700ms sebelum mengklik tombol kedua
        setTimeout(() => {
          // Tombol VALIDATED
          const validatedButton = document.querySelector(
            'button[style*="background-color: rgb(16, 185, 129)"]'
          );
          if (validatedButton) {
            validatedButton.click();
            console.log("Clicked VALIDATED button");
          } else {
            console.log("VALIDATED button not found");
          }

          // Delay 700ms sebelum mengklik tombol ketiga
          setTimeout(() => {
            // Tombol CONFERENCE
            const conferenceButton = document.querySelector(
              'button[style*="background-color: rgb(139, 92, 246)"]'
            );
            if (conferenceButton) {
              conferenceButton.click();
              console.log("Clicked CONFERENCE button");
            } else {
              console.log("CONFERENCE button not found");
            }

            resolve();
          }, 500); // Delay 700ms sebelum mengklik tombol ketiga
        }, 500); // Delay 700ms sebelum mengklik tombol kedua
      }, 700); // Delay 700ms sebelum mengklik tombol pertama
    }

    // Polling untuk memeriksa ketersediaan tombol
    const interval = setInterval(() => {
      if (checkButtonsExist()) {
        clearInterval(interval);
        clearTimeout(timeout);
        buttonsReady = true;
        clickButtons();
      }
    }, 100);

    // Timeout fallback setelah 1,5 detik
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!buttonsReady) {
        console.log("Timeout reached, attempting to click buttons anyway");
        clickButtons();
      }
    }, timeoutMs);
  });
}

// Jalankan fungsi
clickButtonsAfterLoad().then(() => {
  console.log("All buttons clicked or attempted");
});
