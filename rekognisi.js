// =================== KONFIGURASI TOKEN ===================
const BEARER_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZF9wZW5nZ3VuYSI6IkNCRDBGMEMzLTVGMEQtNDYyNC1BOTJELTY3QkY1MjBEMzM5RSIsIm5hbWFfcGVuZ2d1bmEiOiJBRE1JTklTVFJBVE9SIiwiaWRfdGlwZV9wZW5nZ3VuYSI6IkFETSIsInVzZXJuYW1lIjoiYWRtaW4iLCJmbGFnX2JlYXNpc3dhIjowLCJleHAiOjE3NjAwNjE2NzAsImlkX3Byb2dyYW1fc3R1ZGkiOm51bGwsInRpcGVfcGVuZ2d1bmEiOnsiaWRfdGlwZV9wZW5nZ3VuYSI6IkFETSIsIm5hbWFfdGlwZV9wZW5nZ3VuYSI6IkFETUlOIn19.rg8UlAsvG6wE3kYNeCU4ceKC154CrjtimAE-TS6EEOwrH1QQpEQsn414-TK_UQGZxBHG2zlCO7kN5VM8IgckrS3FjTwETfcm2hdvZprgy8yWAYCNdJ_TivQ9U177_4bTYcDfbiby_l7V9usk9iqNBQ98PKs-XKbIZMn15ecabKQ16itGvjgYL3D6ocg8Bo30YhLzdxBZlXf4msp_C-4G6J9TlUCu1mGut4uT6PCe3-Tnp2U0OXy_qJlWXlh3mGfII6T4LKvoldd9XpfOJ5dx_Y0tFjyqon8K2OiCty4BLfzV783Rdf8bDtGjW0Z9yJc-GbB1Yh9qczXGMaEnWRRUbj_ViPYi54XZbFTpjMyOcLYmXb56CFfGeDbnj55Cpes0LgfOxongxW3VP6eNhG04xP_jcglADNvC7meNmiEiflMMWjS98_3n2uBjBxblCshZ7g7beWXtZfhoRQyz7ftR8Td3qwnF6IlF_gwWCl-UNNSRd4fvc1xuW2JYD41yDM6MGe9rYoiKEvn1LUIJIOSTWdna9NyUvShV2LeWUPDeD7Lbv9QYSw3pj2h3tOkYeYChYCFUVicrBNjtt6h_LCmo_71k0a6WAFjNap65qewawQmOlJvg7mOIlyivt0DjbSdlKz43CjZ5HCwenaQkFSPizNyUyo39GXHehaXaJyfEAPc";
const XSRF_TOKEN = "MASUKKAN_XSRF_TOKEN_DISINI";

// =================== MAPPING REKOGNISI ===================
const mappingKategoriKePoint = {
  KR01: 100, KR02: 30, KR03: 15, KR04: 15, KR05: 25, KR06: 20, KR07: 20, KR08: 15,
  KR09: 30, KR10: 30, KR11: 15, KR12: 20, KR13: 25, KR14: 25, KR15: 10, KR16: 5,
  KR17: 10, KR18: 15, KR21: 10, KR22: 10, KR23: 10, KR24: 15, KR25: 20, KR26: 15,
  KR27: 10, KR28: 15, KR29: 20, KR30: 25, KR31: 10, KR32: 15, KR33: 5, KR34: 15,
  KR35: 7, KR36: 10, KR37: 5, KR38: 7, KR39: 5, KR40: 7, KR41: 7, KR42: 20,
  KR43: 15, KR44: 10, KR45: 5, KR46: 15, KR47: 10, KR48: 15, KR49: 25, KR50: 5,
  KR51: 20, KR52: 5, KR53: 15, KR54: 5, KR55: 10, KR56: 5
};

// =================== INJECT CSS ===================
const injectStyles = () => {
  if (document.getElementById('sispema-calculator-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'sispema-calculator-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    #sispema-calculator-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    #sispema-calc-btn {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: #3b82f6;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    #sispema-calc-btn:hover {
      background: #2563eb;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
    
    #sispema-calc-btn:active {
      transform: scale(0.95);
    }
    
    #sispema-calc-btn svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    #sispema-calc-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90vw;
      max-width: 1200px;
      max-height: 90vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -48%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    
    #sispema-calc-popup.show {
      display: flex;
    }
    
    .calc-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999998;
      display: none;
      animation: overlayFade 0.2s ease;
    }
    
    @keyframes overlayFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .calc-overlay.show {
      display: block;
    }
    
    .calc-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      color: #111827;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .calc-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #111827;
    }
    
    .calc-header svg {
      fill: #3b82f6;
    }
    
    .calc-close {
      background: #f3f4f6;
      border: none;
      color: #6b7280;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 18px;
    }
    
    .calc-close:hover {
      background: #e5e7eb;
      color: #111827;
    }
    
    .calc-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    
    .calc-body::-webkit-scrollbar {
      width: 8px;
    }
    
    .calc-body::-webkit-scrollbar-track {
      background: #f3f4f6;
    }
    
    .calc-body::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    
    .calc-body::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
    
    .input-section {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }
    
    .input-group {
      margin-bottom: 0;
    }
    
    .input-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }
    
    .input-row {
      display: flex;
      gap: 12px;
    }
    
    .input-wrapper {
      position: relative;
      flex: 1;
    }
    
    .input-wrapper input {
      width: 100%;
      padding: 10px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      font-family: inherit;
    }
    
    .input-wrapper input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .btn-primary {
      padding: 10px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-primary:active {
      transform: scale(0.98);
    }
    
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .result-container {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
      margin-top: 24px;
    }
    
    .result-sidebar {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }
    
    .profile-section {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 20px;
    }
    
    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 32px;
      margin: 0 auto 16px;
    }
    
    .profile-name {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }
    
    .profile-nim {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 4px 0;
    }
    
    .profile-prodi {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      display: block;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      display: block;
    }
    
    .point-card {
      background: #3b82f6;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .point-label {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .point-value {
      font-size: 48px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .result-main {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }
    
    .tab {
      flex: 1;
      padding: 16px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.2s;
      border-bottom: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .tab:hover {
      color: #111827;
      background: #f3f4f6;
    }
    
    .tab.active {
      color: #3b82f6;
      background: white;
      border-bottom-color: #3b82f6;
    }
    
    .tab-badge {
      background: #e5e7eb;
      color: #6b7280;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .tab.active .tab-badge {
      background: #dbeafe;
      color: #3b82f6;
    }
    
    .tab-content {
      display: none;
      padding: 20px;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .tab-content::-webkit-scrollbar {
      width: 8px;
    }
    
    .tab-content::-webkit-scrollbar-track {
      background: #f3f4f6;
    }
    
    .tab-content::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    
    .rekognisi-item {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }
    
    .rekognisi-item:hover {
      border-color: #d1d5db;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .rekognisi-item.pending {
      opacity: 0.7;
      border-left: 3px solid #f59e0b;
    }
    
    .rekognisi-item.valid {
      border-left: 3px solid #10b981;
    }
    
    .rekognisi-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
    
    .rekognisi-title {
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      flex: 1;
      line-height: 1.5;
    }
    
    .rekognisi-point {
      background: #3b82f6;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      margin-left: 16px;
      white-space: nowrap;
    }
    
    .rekognisi-item.pending .rekognisi-point {
      background: #f59e0b;
    }
    
    .rekognisi-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 13px;
      color: #6b7280;
    }
    
    .rekognisi-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-badge.valid {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #9ca3af;
    }
    
    .empty-state svg {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .error-message {
      background: #fef2f2;
      color: #dc2626;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
      border: 1px solid #fecaca;
      display: flex;
      align-items: start;
      gap: 12px;
    }
    
    .warning-box {
      background: #fffbeb;
      border: 1px solid #fcd34d;
      color: #92400e;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 13px;
      display: flex;
      gap: 12px;
    }
    
    @media (max-width: 1024px) {
      .result-container {
        grid-template-columns: 1fr;
      }
      
      .result-sidebar {
        order: 2;
      }
      
      .result-main {
        order: 1;
      }
    }
    
    @media (max-width: 768px) {
      #sispema-calc-popup {
        width: 95vw;
        max-height: 95vh;
      }
      
      .input-row {
        flex-direction: column;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
};

// =================== CREATE UI ===================
const createUI = () => {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'calc-overlay';
  overlay.id = 'sispema-calc-overlay';
  document.body.appendChild(overlay);
  
  const widget = document.createElement('div');
  widget.id = 'sispema-calculator-widget';
  widget.innerHTML = `
    <button id="sispema-calc-btn" title="SISPEMA Point Calculator">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    </button>
    
    <div id="sispema-calc-popup">
      <div class="calc-header">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          SISPEMA Point Calculator
        </h3>
        <button class="calc-close">✕</button>
      </div>
      
      <div class="calc-body">
        <div id="token-warning" class="warning-box" style="display: none;">
          <span style="font-size: 20px;">⚠️</span>
          <div>
            <strong>Token belum diisi!</strong>
            <div style="margin-top: 4px; font-size: 12px;">
              Edit script dan isi BEARER_TOKEN terlebih dahulu untuk menggunakan fitur ini.
            </div>
          </div>
        </div>
        
        <div class="input-section">
          <div class="input-group">
            <label>Nomor Induk Mahasiswa (NIM)</label>
            <div class="input-row">
              <div class="input-wrapper">
                <input type="text" id="nim-input" placeholder="Masukkan NIM, contoh: 2021010001">
              </div>
              <button class="btn-primary" id="calc-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <span>Hitung Point</span>
              </button>
            </div>
          </div>
        </div>
        
        <div id="result-wrapper"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  // Event listeners
  document.getElementById('sispema-calc-btn').addEventListener('click', togglePopup);
  document.querySelector('.calc-close').addEventListener('click', togglePopup);
  overlay.addEventListener('click', togglePopup);
  document.getElementById('calc-btn').addEventListener('click', handleCalculate);
  document.getElementById('nim-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCalculate();
  });
  
  // Check token
  if (BEARER_TOKEN === "MASUKKAN_TOKEN_BEARER_DISINI") {
    document.getElementById('token-warning').style.display = 'flex';
  }
};

// =================== TOGGLE POPUP ===================
const togglePopup = () => {
  const popup = document.getElementById('sispema-calc-popup');
  const overlay = document.getElementById('sispema-calc-overlay');
  popup.classList.toggle('show');
  overlay.classList.toggle('show');
};

// =================== SWITCH TAB ===================
const switchTab = (tabName) => {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
};

// =================== CALCULATE ===================
const handleCalculate = async () => {
  const nimInput = document.getElementById('nim-input');
  const calcBtn = document.getElementById('calc-btn');
  const resultWrapper = document.getElementById('result-wrapper');
  const nim = nimInput.value.trim();
  
  if (!nim) {
    resultWrapper.innerHTML = '<div class="error-message"><span>❌</span><div><strong>Mohon masukkan NIM terlebih dahulu</strong></div></div>';
    return;
  }
  
  if (BEARER_TOKEN === "MASUKKAN_TOKEN_BEARER_DISINI") {
    resultWrapper.innerHTML = '<div class="error-message"><span>❌</span><div><strong>Token belum diisi!</strong><br>Edit script dan isi BEARER_TOKEN untuk melanjutkan.</div></div>';
    return;
  }
  
  // Show loading
  calcBtn.disabled = true;
  calcBtn.innerHTML = '<div class="loading-spinner"></div><span>Memproses...</span>';
  resultWrapper.innerHTML = '';
  
  try {
    const result = await hitungPointRekognisiByNIM(nim);
    
    if (!result || result.totalRekognisi === 0) {
      resultWrapper.innerHTML = '<div class="error-message"><span>❌</span><div><strong>Data tidak ditemukan</strong><br>Tidak ada data rekognisi untuk NIM: ' + nim + '</div></div>';
      return;
    }
    
    displayResult(result);
    
  } catch (error) {
    resultWrapper.innerHTML = '<div class="error-message"><span>❌</span><div><strong>Terjadi kesalahan</strong><br>' + error.message + '</div></div>';
  } finally {
    calcBtn.disabled = false;
    calcBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <span>Hitung Point</span>
    `;
  }
};

// =================== DISPLAY RESULT ===================
const displayResult = (data) => {
  const container = document.getElementById('result-wrapper');
  const initials = data.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  const validDetails = data.detailRekognisi.filter(d => d.isValid);
  const pendingDetails = data.detailRekognisi.filter(d => !d.isValid);
  
  container.innerHTML = `
    <div class="result-container">
      <div class="result-sidebar">
        <div class="profile-section">
          <div class="profile-avatar">${initials}</div>
          <h4 class="profile-name">${data.nama}</h4>
          <p class="profile-nim">NIM: ${data.nim}</p>
          <p class="profile-prodi">${data.prodi}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">${data.totalRekognisi}</span>
            <span class="stat-label">Total Kegiatan</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" style="color: #10b981;">${data.totalRekognisiValid}</span>
            <span class="stat-label">Tervalidasi</span>
          </div>
        </div>
        
        <div class="point-card">
          <div class="point-label">Total Point Rekognisi</div>
          <div class="point-value">
            <span>🏆</span>
            <span>${data.totalPoint}</span>
          </div>
        </div>
      </div>
      
      <div class="result-main">
        <div class="tabs">
          <button class="tab active" data-tab="valid" onclick="window.switchTab('valid')">
            <span>✓ Tervalidasi</span>
            <span class="tab-badge">${validDetails.length}</span>
          </button>
          <button class="tab" data-tab="pending" onclick="window.switchTab('pending')">
            <span>⏳ Menunggu</span>
            <span class="tab-badge">${pendingDetails.length}</span>
          </button>
          <button class="tab" data-tab="all" onclick="window.switchTab('all')">
            <span>📋 Semua</span>
            <span class="tab-badge">${data.totalRekognisi}</span>
          </button>
        </div>
        
        <div id="tab-valid" class="tab-content active">
          ${validDetails.length > 0 ? validDetails.map(item => `
            <div class="rekognisi-item valid">
              <div class="rekognisi-header">
                <div class="rekognisi-title">${item.namaKegiatan}</div>
                <div class="rekognisi-point">${item.point} Point</div>
              </div>
              <div class="rekognisi-meta">
                <div class="rekognisi-meta-item">
                  <span>📋</span>
                  <span>${item.kategori} (${item.kategoriId})</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span>📅</span>
                  <span>Tahun ${item.tahunKegiatan}</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span class="status-badge valid">✓ ${item.status}</span>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>Belum ada rekognisi yang tervalidasi</div>
            </div>
          `}
        </div>
        
        <div id="tab-pending" class="tab-content">
          ${pendingDetails.length > 0 ? pendingDetails.map(item => `
            <div class="rekognisi-item pending">
              <div class="rekognisi-header">
                <div class="rekognisi-title">${item.namaKegiatan}</div>
                <div class="rekognisi-point">${item.point} Point</div>
              </div>
              <div class="rekognisi-meta">
                <div class="rekognisi-meta-item">
                  <span>📋</span>
                  <span>${item.kategori} (${item.kategoriId})</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span>📅</span>
                  <span>Tahun ${item.tahunKegiatan}</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span class="status-badge pending">⏳ ${item.status}</span>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <div>Tidak ada rekognisi yang menunggu validasi</div>
            </div>
          `}
        </div>
        
        <div id="tab-all" class="tab-content">
          ${data.detailRekognisi.map(item => `
            <div class="rekognisi-item ${item.isValid ? 'valid' : 'pending'}">
              <div class="rekognisi-header">
                <div class="rekognisi-title">${item.namaKegiatan}</div>
                <div class="rekognisi-point">${item.point} Point</div>
              </div>
              <div class="rekognisi-meta">
                <div class="rekognisi-meta-item">
                  <span>📋</span>
                  <span>${item.kategori} (${item.kategoriId})</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span>📅</span>
                  <span>Tahun ${item.tahunKegiatan}</span>
                </div>
                <div class="rekognisi-meta-item">
                  <span class="status-badge ${item.isValid ? 'valid' : 'pending'}">
                    ${item.isValid ? '✓' : '⏳'} ${item.status}
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Expose switchTab to window
  window.switchTab = switchTab;
};

// =================== API FUNCTION ===================
async function hitungPointRekognisiByNIM(nim) {
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'X-Requested-With': 'XMLHttpRequest'
  };
  
  if (XSRF_TOKEN && XSRF_TOKEN !== "MASUKKAN_XSRF_TOKEN_DISINI") {
    headers['X-XSRF-TOKEN'] = XSRF_TOKEN;
  }

  let allData = [];
  let currentPage = 1;
  let totalPages = 1;
  
  do {
    const apiUrl = `https://sispema.unpam.ac.id/api/rekognisi/ajuan?page=${currentPage}&per_page=100&search=${nim}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - Token mungkin sudah expired`);
    }

    const result = await response.json();
    const pageData = result.data?.data || result.data?.pribadi || result.data || [];
    const filteredData = pageData.filter(item => 
      item.mahasiswa?.nim === nim || item.nim === nim
    );
    
    allData = allData.concat(filteredData);
    
    if (result.data?.last_page) {
      totalPages = result.data.last_page;
    } else if (pageData.length === 0) {
      break;
    }
    
    currentPage++;
    
    if (currentPage <= totalPages) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } while (currentPage <= totalPages);

  if (allData.length === 0) {
    return {
      nim: nim,
      nama: 'Tidak Ditemukan',
      prodi: 'N/A',
      totalRekognisi: 0,
      totalRekognisiValid: 0,
      totalPoint: 0,
      detailRekognisi: []
    };
  }

  const mahasiswa = allData[0].mahasiswa || allData[0];
  const namaMahasiswa = mahasiswa.nama_mahasiswa || mahasiswa.nama || 'N/A';
  const nimMahasiswa = mahasiswa.nim || nim;
  const prodiMahasiswa = allData[0].program_studi?.nama_program_studi || 'N/A';

  let totalPoint = 0;
  let totalRekognisiValid = 0;
  const detailRekognisi = [];

  allData.forEach((item, index) => {
    const kategoriId = item.id_kategori_rekognisi;
    const namaKategori = item.kategori_rekognisi?.nama_kategori_rekognisi || 'Unknown';
    const point = mappingKategoriKePoint[kategoriId] || 0;
    const statusValidasi = item.validasi?.nama_status_validasi || 'BELUM DIVALIDASI';
    const isValid = item.id_status_validasi === 4 || item.id_status_validasi === 1;

    const detail = {
      no: index + 1,
      namaKegiatan: item.nama_kegiatan,
      kategori: namaKategori,
      kategoriId: kategoriId,
      point: point,
      tahunKegiatan: item.tahun_kegiatan,
      tanggalAjuan: item.tanggal_ajuan,
      status: statusValidasi,
      isValid: isValid
    };

    detailRekognisi.push(detail);

    if (isValid) {
      totalPoint += point;
      totalRekognisiValid++;
    }
  });

  return {
    nim: nimMahasiswa,
    nama: namaMahasiswa,
    prodi: prodiMahasiswa,
    totalRekognisi: allData.length,
    totalRekognisiValid: totalRekognisiValid,
    totalPoint: totalPoint,
    detailRekognisi: detailRekognisi
  };
}

// =================== INITIALIZE ===================
const init = () => {
  injectStyles();
  createUI();
  console.log('%c✨ SISPEMA Point Calculator v3.0', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
  console.log('%c💡 Klik tombol di kanan bawah untuk membuka calculator', 'color: #6b7280;');
};

// Auto initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export untuk akses manual
window.sispemaCalculator = {
  hitungPointRekognisiByNIM,
  togglePopup
};
