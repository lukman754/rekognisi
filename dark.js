let darkMode = document.createElement("style");
darkMode.innerText = `
  html, body {
    height: 100%;
    color: #e0e0e0;
  }

  * {
    color: black;
  }
    
  /* Membalik warna halaman kecuali gambar & video */
  html {
    filter: invert(1) hue-rotate(180deg);
  }

  /* Mengembalikan warna asli gambar & video */
  img, video, iframe {
    filter: invert(1) hue-rotate(180deg) !important;
  }


`;
document.head.appendChild(darkMode);
