let darkMode = document.createElement("style");
darkMode.innerText = `
  html {
    filter: invert(1) hue-rotate(180deg);
    background: black;
  }
  img, video {
    filter: invert(1) hue-rotate(180deg);
  }
`;
document.head.appendChild(darkMode);
