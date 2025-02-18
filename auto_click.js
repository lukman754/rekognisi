// Fungsi untuk mengklik tombol-tombol dengan delay 700ms
function clickButtonsWithDelay() {
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
      console.log(
        `[${new Date().toLocaleTimeString()}] Preparing to click buttons with 700ms delays...`
      );

      // Delay 700ms sebelum mengklik tombol pertama
      setTimeout(() => {
        // Tombol GANJIL 24/25
        const ganjilButton = document.querySelector(
          'button[style*="background-color: rgb(239, 68, 68)"]'
        );
        if (ganjilButton) {
          ganjilButton.click();
          console.log(
            `[${new Date().toLocaleTimeString()}] Clicked GANJIL 24/25 button`
          );
        } else {
          console.log(
            `[${new Date().toLocaleTimeString()}] GANJIL 24/25 button not found`
          );
        }

        // Delay 700ms sebelum mengklik tombol kedua
        setTimeout(() => {
          // Tombol VALIDATED
          const validatedButton = document.querySelector(
            'button[style*="background-color: rgb(16, 185, 129)"]'
          );
          if (validatedButton) {
            validatedButton.click();
            console.log(
              `[${new Date().toLocaleTimeString()}] Clicked VALIDATED button`
            );
          } else {
            console.log(
              `[${new Date().toLocaleTimeString()}] VALIDATED button not found`
            );
          }

          // Delay 700ms sebelum mengklik tombol ketiga
          setTimeout(() => {
            // Tombol CONFERENCE
            const conferenceButton = document.querySelector(
              'button[style*="background-color: rgb(139, 92, 246)"]'
            );
            if (conferenceButton) {
              conferenceButton.click();
              console.log(
                `[${new Date().toLocaleTimeString()}] Clicked CONFERENCE button`
              );
            } else {
              console.log(
                `[${new Date().toLocaleTimeString()}] CONFERENCE button not found`
              );
            }

            resolve();
          }, 700); // Delay 700ms sebelum mengklik tombol ketiga
        }, 700); // Delay 700ms sebelum mengklik tombol kedua
      }, 1000); // Delay 700ms sebelum mengklik tombol pertama
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
        console.log(
          `[${new Date().toLocaleTimeString()}] Timeout reached, attempting to click buttons anyway`
        );
        clickButtons();
      }
    }, timeoutMs);
  });
}

// Variabel untuk menyimpan URL saat ini
let currentUrl = window.location.href;

// Fungsi untuk memeriksa perubahan URL dan menjalankan clickButtonsWithDelay
function monitorUrlAndClickButtons() {
  console.log(`[${new Date().toLocaleTimeString()}] Starting URL monitor...`);
  console.log(
    `[${new Date().toLocaleTimeString()}] Initial URL: ${currentUrl}`
  );

  // Jalankan sekali di awal
  clickButtonsWithDelay().then(() => {
    console.log(
      `[${new Date().toLocaleTimeString()}] Initial button clicks completed`
    );
  });

  // Mengamati perubahan URL dengan setInterval
  setInterval(() => {
    if (currentUrl !== window.location.href) {
      const previousUrl = currentUrl;
      currentUrl = window.location.href;
      console.log(`[${new Date().toLocaleTimeString()}] URL changed!`);
      console.log(`[${new Date().toLocaleTimeString()}] From: ${previousUrl}`);
      console.log(`[${new Date().toLocaleTimeString()}] To: ${currentUrl}`);

      // Tunggu sedikit setelah perubahan URL untuk memastikan halaman dimuat
      setTimeout(() => {
        clickButtonsWithDelay().then(() => {
          console.log(
            `[${new Date().toLocaleTimeString()}] Button clicks completed after URL change`
          );
        });
      }, 500);
    }
  }, 1000); // Cek perubahan URL setiap 1 detik
}

// Mulai monitoring URL
monitorUrlAndClickButtons();
