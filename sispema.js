// Utility class for managing status and collapsible display
class DisplayManager {
  constructor() {
    this.setupCollapsibleDisplay();
  }

  setupCollapsibleDisplay() {
    this.createContainer();
    this.createHeader();
    this.createContent();
    this.setupDraggable();
    document.body.appendChild(this.container);
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      width: 400px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      font-family: system-ui, -apple-system, sans-serif;
      transition: all 0.2s ease;
    `;
  }

  createHeader() {
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f9fafb;
      color: #111827;
      border-radius: 12px 12px 0 0;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      border-bottom: 1px solid #e5e7eb;
    `;

    const title = document.createElement("span");
    title.textContent = "Process Log & Data";
    title.style.fontSize = "0.975rem";

    const toggleButton = this.createButton("−", "#6b7280");

    header.onclick = () => this.toggleContent(toggleButton);

    header.appendChild(title);
    header.appendChild(toggleButton);
    this.container.appendChild(header);
  }

  createContent() {
    this.content = document.createElement("div");
    this.content.style.padding = "16px";

    this.createLogSection();
    this.createJsonSection();
    this.container.appendChild(this.content);
  }

  createLogSection() {
    this.logElement = document.createElement("div");
    this.logElement.style.cssText = `
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 16px;
      padding: 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #4b5563;
      line-height: 1.5;
    `;
    this.content.appendChild(this.logElement);
  }

  createJsonSection() {
    this.jsonDisplay = document.createElement("div");
    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    `;

    this.copyButton = this.createActionButton("Copy JSON");
    this.clearButton = this.createActionButton("Clear All");
    this.clearButton.onclick = () => this.clearAll();

    this.jsonContent = document.createElement("pre");
    this.jsonContent.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
      background: #f9fafb;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 0.875rem;
      color: #4b5563;
      line-height: 1.5;
    `;

    this.buttonsContainer.appendChild(this.copyButton);
    this.buttonsContainer.appendChild(this.clearButton);
    this.jsonDisplay.appendChild(this.buttonsContainer);
    this.jsonDisplay.appendChild(this.jsonContent);
    this.content.appendChild(this.jsonDisplay);
  }

  createButton(text, color) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.cssText = `
      background: none;
      border: none;
      color: ${color};
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0 5px;
      line-height: 1;
      transition: color 0.2s ease;
    `;
    return button;
  }

  createActionButton(text) {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.cssText = `
      padding: 8px 16px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.2s ease;
    `;

    button.addEventListener("mouseover", () => {
      button.style.background = "#059669";
    });

    button.addEventListener("mouseout", () => {
      button.style.background = "#10b981";
    });

    return button;
  }

  setupDraggable() {
    let isDragging = false;
    let offsetX, offsetY;

    this.container.addEventListener("mousedown", (e) => {
      if (
        e.target === this.container ||
        e.target === this.container.querySelector("div")
      ) {
        isDragging = true;
        offsetX = e.clientX - this.container.getBoundingClientRect().left;
        offsetY = e.clientY - this.container.getBoundingClientRect().top;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        this.container.style.left = `${e.clientX - offsetX}px`;
        this.container.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  toggleContent(toggleButton) {
    if (this.content.style.display === "none") {
      this.content.style.display = "block";
      toggleButton.textContent = "−";
    } else {
      this.content.style.display = "none";
      toggleButton.textContent = "+";
    }
  }

  clearAll() {
    this.logElement.innerHTML = "";
    this.jsonContent.textContent = "";
    this.addLog("Log and JSON data cleared");
  }

  addLog(message) {
    const logEntry = document.createElement("div");
    logEntry.style.cssText = `
      padding: 4px 0;
      border-bottom: 1px solid #e5e7eb;
    `;
    logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    this.logElement.appendChild(logEntry);
    this.logElement.scrollTop = this.logElement.scrollHeight;
    console.log(message);
  }

  updateJson(data) {
    const jsonString = JSON.stringify(data, null, 2);
    this.jsonContent.textContent = jsonString;

    this.copyButton.onclick = () => {
      navigator.clipboard.writeText(jsonString);
      this.copyButton.textContent = "Copied!";
      setTimeout(() => {
        this.copyButton.textContent = "Copy JSON";
      }, 2000);
    };
  }

  remove() {
    this.container.remove();
  }
}

// URL Tracking Class
class UrlTracker {
  constructor(displayManager) {
    this.trackedUrls = [];
    this.originalOpen = window.open;
    this.displayManager = displayManager;
  }

  startTracking() {
    const tracker = this;
    window.open = function (...args) {
      const url = args[0];
      if (url) {
        tracker.displayManager.addLog(`Tracked URL: ${url}`);
        tracker.trackedUrls.push(url);
      }
      return tracker.originalOpen.apply(this, args);
    };
  }

  getTrackedUrls() {
    return this.trackedUrls;
  }

  resetTracking() {
    window.open = this.originalOpen;
    this.trackedUrls = [];
  }
}

class DataExtractor {
  constructor(displayManager) {
    this.displayManager = displayManager;
    this.urlTracker = new UrlTracker(displayManager);
  }

  getTextContent(element) {
    return element ? element.textContent.trim() : "";
  }

  extractMahasiswaData() {
    const data = {};
    this.displayManager.addLog("Extracting student data...");
    document
      .querySelectorAll(".q-card__section .row.q-col-gutter-sm")
      .forEach((row) => {
        row.querySelectorAll(".col-lg-4").forEach((col) => {
          const label = this.getTextContent(
            col.querySelector(".text-caption.text-grey-7")
          );
          const value = this.getTextContent(
            col.querySelector("div:not(.text-caption)")
          );
          if (label && value) {
            data[label] = value;
            this.displayManager.addLog(`Found ${label}: ${value}`);
          }
        });
      });
    return data;
  }

  extractDosenData() {
    const data = [];
    this.displayManager.addLog("Extracting lecturer data...");

    // Find the table within the "Dosen Pendamping" section
    const dosenSection = Array.from(document.querySelectorAll(".color-title"))
      .find((el) => el.textContent.includes("Dosen Pendamping"))
      ?.closest(".q-card");

    if (dosenSection) {
      dosenSection.querySelectorAll("table tbody tr").forEach((row) => {
        const dosenData = {
          id: this.getTextContent(row.querySelector("td:nth-child(1)")),
          nama: this.getTextContent(row.querySelector("td:nth-child(2)")),
          status: this.getTextContent(row.querySelector("td:nth-child(3)")),
        };
        data.push(dosenData);
        this.displayManager.addLog(`Found lecturer: ${dosenData.nama}`);
      });
    }

    return data;
  }

  extractAnggotaKelompok() {
    const data = [];
    this.displayManager.addLog("Extracting group members data...");

    // Find the table within the "Anggota Kelompok" section
    const anggotaSection = Array.from(document.querySelectorAll(".color-title"))
      .find((el) => el.textContent.includes("Anggota Kelompok"))
      ?.closest(".q-card");

    if (anggotaSection) {
      anggotaSection.querySelectorAll("table tbody tr").forEach((row) => {
        const anggotaData = {
          nim: this.getTextContent(row.querySelector("td:nth-child(1)")),
          nama: this.getTextContent(row.querySelector("td:nth-child(2)")),
          status: this.getTextContent(row.querySelector("td:nth-child(3)"))
            .replace(/\s+/g, " ")
            .trim(),
        };
        data.push(anggotaData);
        this.displayManager.addLog(`Found group member: ${anggotaData.nim}`);
      });
    }

    return data;
  }

  formatActivityName(jenisKegiatan) {
    return jenisKegiatan
      .replace("Berperan Aktif Sebagai ", "")
      .replace(" Dalam Suatu Kegiatan ", "")
      .replace(" Sebagai Ketua/Sekretaris/Bendahara/Kabid", "")
      .replace("Sekretaris/Bendahara/Kabid/Steering ", "")
      .trim();
  }

  async extractSyaratPendukung(mahasiswaData) {
    const syaratPendukung = [];
    this.displayManager.addLog("Extracting supporting documents...");

    const nim = mahasiswaData["Nim"] || "unknown";
    const tanggalAjuan =
      mahasiswaData["Tanggal Ajuan"] || new Date().toISOString().split("T")[0];
    let jenisKegiatan = mahasiswaData["Jenis Kegiatan"] || "unknown";
    jenisKegiatan = this.formatActivityName(jenisKegiatan);

    for (const row of document.querySelectorAll("table tbody tr")) {
      const documentName = this.getTextContent(
        row.querySelector("td.text-left")
      );
      const button = row.querySelector(".my-button");

      if (documentName && button) {
        this.displayManager.addLog(`Processing document: ${documentName}`);
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const lastUrl = this.urlTracker.getTrackedUrls().pop();
        if (lastUrl) {
          const sanitizeForFilename = (str) => {
            return str.replace(/[<>:"/\\|?*]/g, "");
          };

          const name = [jenisKegiatan, nim, tanggalAjuan, documentName]
            .map(sanitizeForFilename)
            .join("_");

          syaratPendukung.push({
            name,
            url: lastUrl,
          });
        }
      }
    }

    this.displayManager.updateJson(syaratPendukung);
    return syaratPendukung;
  }

  async extractAllData() {
    this.urlTracker.startTracking();
    const mahasiswaData = this.extractMahasiswaData();
    const dosenData = this.extractDosenData();
    const anggotaKelompok = this.extractAnggotaKelompok();
    const syaratPendukung = await this.extractSyaratPendukung(mahasiswaData);
    this.urlTracker.resetTracking();

    return {
      mahasiswa: mahasiswaData,
      dosenPendamping: dosenData,
      anggotaKelompok: anggotaKelompok,
      syaratPendukung: syaratPendukung,
      metadata: {
        extractedAt: new Date().toISOString(),
        source: window.location.href,
      },
    };
  }
}

// Main application
class DataExtractionApp {
  constructor() {
    this.displayManager = new DisplayManager();
    this.extractor = new DataExtractor(this.displayManager);
    this.addExtractionButton();
  }

  addExtractionButton() {
    const button = document.createElement("button");
    button.textContent = "Ekstrak Data";
    button.style.cssText = `
      padding: 8px 16px;
      background:rgb(120, 185, 16);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.2s ease;
    `;

    button.addEventListener("mouseover", () => {
      button.style.background = "#059669";
    });

    button.addEventListener("mouseout", () => {
      button.style.background = "#10b981";
    });

    button.onclick = () => this.start();

    // Add both buttons to the buttons container
    this.displayManager.buttonsContainer.appendChild(button);
    this.displayManager.buttonsContainer.appendChild(
      this.displayManager.copyButton
    );
  }

  async downloadJson(data) {
    const nim = data.mahasiswa?.["Nim"] || "unknown";
    const tanggalAjuan =
      data.mahasiswa?.["Tanggal Ajuan"] ||
      new Date().toISOString().split("T")[0];
    let jenisKegiatan = data.mahasiswa?.["Jenis Kegiatan"] || "unknown";

    // Remove the specified phrases
    jenisKegiatan = jenisKegiatan
      .replace("Berperan Aktif Sebagai ", "")
      .replace(" Dalam Suatu Kegiatan", "")
      .replace(" Sebagai Ketua/Sekretaris/Bendahara/Kabid", "")
      .replace("Sekretaris/Bendahara/Kabid/Steering ", "")
      .trim();

    const sanitizeForFilename = (str) => {
      return str
        .replace(/[^a-zA-Z0-9 ]/gi, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const filename =
      [
        sanitizeForFilename(jenisKegiatan),
        sanitizeForFilename(nim),
        sanitizeForFilename(tanggalAjuan),
      ].join("_") + "_Data Rekognisi.json";

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async start() {
    try {
      const data = await this.extractor.extractAllData();
      await this.downloadJson(data);
      this.displayManager.addLog("Process completed successfully");
    } catch (error) {
      console.error("Error:", error);
      this.displayManager.addLog(`Error occurred: ${error.message}`);
    }
  }
}

// Initialize application
const app = new DataExtractionApp();
console.log('Script ready. Click "Ekstrak Data" button to start.');
