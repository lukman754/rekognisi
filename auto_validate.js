// ==================== REKOGNISI AUTO VALIDATOR ====================
// Paste script ini di Console DevTools (F12) di halaman sispema.unpam.ac.id
// UI popup akan muncul otomatis menggunakan React
// ===================================================================

(function() {
  'use strict';

  // Cek apakah React sudah ada
  if (!window.React || !window.ReactDOM) {
    console.log('⏳ Loading React...');
    
    // Load React
    const reactScript = document.createElement('script');
    reactScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js';
    reactScript.crossOrigin = 'anonymous';
    
    const reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js';
    reactDOMScript.crossOrigin = 'anonymous';
    
    document.head.appendChild(reactScript);
    document.head.appendChild(reactDOMScript);
    
    reactDOMScript.onload = () => {
      console.log('✅ React loaded!');
      initApp();
    };
  } else {
    initApp();
  }

  function initApp() {
    const { createElement: e, useState, useRef, useEffect } = window.React;

    const RekognisiValidator = () => {
      // Load token from localStorage on mount
      const [config, setConfig] = useState(() => {
        const savedToken = localStorage.getItem('rekognisi_token') || '';
        return {
          token: savedToken,
          pageFrom: 1,
          pageTo: 10,
          perPage: 100,
          delay: 2500,
          maxRetry: 5
        };
      });

      const [state, setState] = useState({
        fetchedIds: [],
        filteredIds: [],
        validatedIds: [],
        progress: 0,
        isRunning: false,
        logs: []
      });

      const [isVisible, setIsVisible] = useState(true);
      const [position, setPosition] = useState({ x: 20, y: 20 });
      const [isDragging, setIsDragging] = useState(false);
      const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
      const logRef = useRef(null);
      const isRunningRef = useRef(false);

      const API_BASE = 'https://sispema.unpam.ac.id/api/rekognisi/ajuan';
      const API_VALIDASI = 'https://sispema.unpam.ac.id/api/rekognisi/validasi';

      useEffect(() => {
        if (logRef.current) {
          logRef.current.scrollTop = logRef.current.scrollHeight;
        }
      }, [state.logs]);

      // Save token to localStorage whenever it changes
      useEffect(() => {
        if (config.token) {
          localStorage.setItem('rekognisi_token', config.token);
        }
      }, [config.token]);

      // Handle dragging
      useEffect(() => {
        const handleMouseMove = (e) => {
          if (isDragging) {
            setPosition({
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y
            });
          }
        };

        const handleMouseUp = () => {
          setIsDragging(false);
        };

        if (isDragging) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }, [isDragging, dragOffset]);

      const handleMouseDown = (e) => {
        // Only drag from header
        if (e.target.closest('.drag-handle')) {
          const rect = e.currentTarget.getBoundingClientRect();
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
          setIsDragging(true);
        }
      };

      const log = (msg, type = 'info') => {
        setState(prev => ({
          ...prev,
          logs: [...prev.logs, { msg, type, time: new Date().toLocaleTimeString() }]
        }));
      };

      const getXsrfToken = () => {
        return decodeURIComponent(
          document.cookie
            .split('; ')
            .find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] || ''
        );
      };

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      const fetchWithRateLimit = async (url, options = {}) => {
        const xsrf = getXsrfToken();

        for (let attempt = 1; attempt <= config.maxRetry; attempt++) {
          const res = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${config.token}`,
              'X-XSRF-TOKEN': xsrf,
              'Content-Type': 'application/json',
              ...(options.headers || {})
            },
            ...options
          });

          if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After');
            let waitMs = retryAfter && !isNaN(parseInt(retryAfter))
              ? parseInt(retryAfter) * 1000
              : 3000 * attempt;

            log(`Rate limit, tunggu ${waitMs}ms`, 'warning');
            await delay(waitMs);
            continue;
          }

          if (!res.ok) {
            log(`Error ${res.status}: ${res.statusText}`, 'error');
            return null;
          }

          const ct = res.headers.get('Content-Type') || '';
          if (ct.includes('application/json')) {
            return res.json();
          }
          return null;
        }

        log(`Gagal setelah ${config.maxRetry} percobaan`, 'error');
        return null;
      };

      const getIds = async (page) => {
        const res = await fetchWithRateLimit(
          `${API_BASE}?page=${page}&per_page=${config.perPage}&id_status_validasi=0`,
          { method: 'GET' }
        );
        return res?.data?.map(item => item.id_ajuan_rekognisi) || [];
      };

      const getAllIds = async () => {
        let allIds = [];
        for (let p = config.pageFrom; p <= config.pageTo; p++) {
          const ids = await getIds(p);
          if (ids.length === 0) break;
          allIds.push(...ids);
          log(`Page ${p}: ${ids.length} ID`, 'success');
          await delay(1000);
        }
        return allIds;
      };

      const getDetailAjuan = async (id) => {
        const json = await fetchWithRateLimit(`${API_BASE}/${id}`, { method: 'GET' });
        return json?.data || null;
      };

      const parseApprovalStatus = (str) => {
        if (!str) return null;
        const match = str.match(/^(\d+)\/(\d+)\s+Disetujui/i);
        if (!match) return null;
        const current = parseInt(match[1], 10);
        const total = parseInt(match[2], 10);
        return { current, total, allApproved: current === total && total > 0 };
      };

      const isAjuanEligible = (detail) => {
        const vPembimbing = detail.v_pembimbing ?? null;
        const vAnggota = detail.v_anggota ?? null;
        const pemb = parseApprovalStatus(vPembimbing);
        const ang = parseApprovalStatus(vAnggota);
        const pembNull = vPembimbing === null;
        const angNull = vAnggota === null;

        if (pemb?.allApproved && ang?.allApproved) return true;
        if (pembNull && angNull) return true;
        if (pembNull && ang?.allApproved) return true;
        if (angNull && pemb?.allApproved) return true;
        return false;
      };

      const validateAjuan = async (id) => {
        const payload = { id_status_validasi: "4", catatan: "ok" };
        const json = await fetchWithRateLimit(`${API_VALIDASI}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        return json?.code === 200 || json?.title?.toLowerCase() === 'sukses';
      };

      const filterAndValidate = async (ids, startIndex = 0) => {
        const filtered = [...state.filteredIds];
        const validated = [...state.validatedIds];

        for (let i = startIndex; i < ids.length; i++) {
          if (!isRunningRef.current) {
            log('Proses dihentikan', 'warning');
            break;
          }

          const id = ids[i];
          log(`[${i + 1}/${ids.length}] Cek ID: ${id}`, 'info');

          const detail = await getDetailAjuan(id);
          if (!detail) {
            log(`Gagal ambil detail ID: ${id}`, 'warning');
            setState(prev => ({ ...prev, progress: i + 1 }));
            continue;
          }

          if (isAjuanEligible(detail)) {
            log(`LOLOS - ID: ${id}`, 'success');
            filtered.push(id);

            const okVal = await validateAjuan(id);
            if (okVal) {
              validated.push(id);
              log(`Validasi OK - ID: ${id}`, 'success');
            } else {
              log(`Validasi gagal - ID: ${id}`, 'warning');
            }
          } else {
            log(`Tidak lolos - ID: ${id}`, 'info');
          }

          setState(prev => ({
            ...prev,
            progress: i + 1,
            filteredIds: filtered,
            validatedIds: validated
          }));

          await delay(config.delay);
        }

        log('Proses selesai!', 'success');
        isRunningRef.current = false;
        setState(prev => ({ ...prev, isRunning: false }));
      };

      const handleStart = async () => {
        if (!config.token.trim()) {
          alert('Token harus diisi!');
          return;
        }

        isRunningRef.current = true;
        setState(prev => ({
          ...prev,
          isRunning: true,
          logs: [],
          fetchedIds: [],
          filteredIds: [],
          validatedIds: [],
          progress: 0
        }));

        log('Memulai pengambilan ID...', 'info');
        const ids = await getAllIds();
        
        setState(prev => ({ ...prev, fetchedIds: ids }));
        log(`Total ID: ${ids.length}`, 'success');

        if (ids.length > 0) {
          log('Memulai filter & validasi...', 'info');
          await filterAndValidate(ids);
        } else {
          log('Tidak ada ID ditemukan', 'error');
          isRunningRef.current = false;
          setState(prev => ({ ...prev, isRunning: false }));
        }
      };

      const handleContinue = async () => {
        if (state.fetchedIds.length === 0) {
          alert('Tidak ada data untuk dilanjutkan. Jalankan proses baru.');
          return;
        }

        isRunningRef.current = true;
        setState(prev => ({ ...prev, isRunning: true }));
        log(`Melanjutkan dari index ${state.progress}...`, 'info');
        await filterAndValidate(state.fetchedIds, state.progress);
      };

      const handleStop = () => {
        isRunningRef.current = false;
        setState(prev => ({ ...prev, isRunning: false }));
        log('Proses dihentikan', 'warning');
      };

      if (!isVisible) return null;

      const inputStyle = {
        width: '100%',
        padding: '9px 12px',
        border: '1px solid #3a3a3a',
        borderRadius: '6px',
        fontSize: '13px',
        background: '#2a2a2a',
        color: '#e0e0e0',
        outline: 'none'
      };

      const btnStyle = {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: '8px',
        transition: 'all 0.2s'
      };

      return e('div', {
        style: {
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: '480px',
          maxHeight: '90vh',
          background: '#1e1e1e',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #2a2a2a',
          userSelect: isDragging ? 'none' : 'auto'
        },
        onMouseDown: handleMouseDown
      },
        // Header
        e('div', {
          className: 'drag-handle',
          style: {
            background: '#252525',
            color: '#e0e0e0',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #2a2a2a',
            cursor: isDragging ? 'grabbing' : 'grab'
          }
        },
          e('h2', { style: { fontSize: '16px', margin: 0, fontWeight: 600 } }, 'Rekognisi Auto Validator'),
          e('button', {
            onClick: () => setIsVisible(false),
            style: {
              background: 'transparent',
              border: 'none',
              color: '#999',
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            },
            onMouseEnter: (e) => {
              e.target.style.background = '#333';
              e.target.style.color = '#fff';
            },
            onMouseLeave: (e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#999';
            }
          }, '×')
        ),
        
        // Content
        e('div', { style: { padding: '20px', overflowY: 'auto', flex: 1 } },
          // Config Section
          e('div', {
            style: {
              marginBottom: '18px',
              padding: '16px',
              background: '#252525',
              borderRadius: '8px',
              border: '1px solid #2a2a2a'
            }
          },
            e('h3', { style: { fontSize: '13px', marginBottom: '14px', color: '#e0e0e0', fontWeight: 600 } }, 'Konfigurasi'),
            
            e('div', { style: { marginBottom: '12px' } },
              e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Bearer Token'),
              e('input', {
                type: 'text',
                value: config.token,
                onChange: (ev) => setConfig({ ...config, token: ev.target.value }),
                placeholder: 'Paste token di sini...',
                style: inputStyle
              })
            ),

            e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' } },
              e('div', {},
                e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Page From'),
                e('input', {
                  type: 'number',
                  value: config.pageFrom,
                  onChange: (ev) => setConfig({ ...config, pageFrom: parseInt(ev.target.value) || 1 }),
                  style: inputStyle
                })
              ),
              e('div', {},
                e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Page To'),
                e('input', {
                  type: 'number',
                  value: config.pageTo,
                  onChange: (ev) => setConfig({ ...config, pageTo: parseInt(ev.target.value) || 10 }),
                  style: inputStyle
                })
              ),
              e('div', {},
                e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Per Page'),
                e('input', {
                  type: 'number',
                  value: config.perPage,
                  onChange: (ev) => setConfig({ ...config, perPage: parseInt(ev.target.value) || 100 }),
                  style: inputStyle
                })
              )
            ),

            e('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
              e('div', {},
                e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Delay (ms)'),
                e('input', {
                  type: 'number',
                  value: config.delay,
                  onChange: (ev) => setConfig({ ...config, delay: parseInt(ev.target.value) || 2500 }),
                  style: inputStyle
                })
              ),
              e('div', {},
                e('label', { style: { display: 'block', fontSize: '12px', color: '#999', marginBottom: '6px' } }, 'Max Retry'),
                e('input', {
                  type: 'number',
                  value: config.maxRetry,
                  onChange: (ev) => setConfig({ ...config, maxRetry: parseInt(ev.target.value) || 5 }),
                  style: inputStyle
                })
              )
            )
          ),

          // Stats
          e('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' } },
            e('div', { style: { padding: '14px', background: '#252525', borderRadius: '8px', textAlign: 'center', border: '1px solid #2a2a2a' } },
              e('div', { style: { fontSize: '26px', fontWeight: 'bold', color: '#b8860b' } }, state.fetchedIds.length),
              e('div', { style: { fontSize: '11px', color: '#888', marginTop: '4px' } }, 'ID Diambil')
            ),
            e('div', { style: { padding: '14px', background: '#252525', borderRadius: '8px', textAlign: 'center', border: '1px solid #2a2a2a' } },
              e('div', { style: { fontSize: '26px', fontWeight: 'bold', color: '#b8860b' } }, state.filteredIds.length),
              e('div', { style: { fontSize: '11px', color: '#888', marginTop: '4px' } }, 'Lolos Filter')
            ),
            e('div', { style: { padding: '14px', background: '#252525', borderRadius: '8px', textAlign: 'center', border: '1px solid #2a2a2a' } },
              e('div', { style: { fontSize: '26px', fontWeight: 'bold', color: '#b8860b' } }, state.validatedIds.length),
              e('div', { style: { fontSize: '11px', color: '#888', marginTop: '4px' } }, 'Tervalidasi')
            )
          ),

          // Buttons
          e('div', { style: { marginBottom: '15px' } },
            !state.isRunning
              ? e('div', {},
                  e('button', {
                    onClick: handleStart,
                    style: { ...btnStyle, background: '#b8860b', color: '#1e1e1e' },
                    onMouseEnter: (e) => e.target.style.background = '#d4a017',
                    onMouseLeave: (e) => e.target.style.background = '#b8860b'
                  }, '▶ Mulai'),
                  state.fetchedIds.length > 0 && state.progress > 0
                    ? e('button', {
                        onClick: handleContinue,
                        style: { ...btnStyle, background: '#4a9d4e', color: '#fff' },
                        onMouseEnter: (e) => e.target.style.background = '#5cb360',
                        onMouseLeave: (e) => e.target.style.background = '#4a9d4e'
                      }, `▶ Lanjutkan (${state.progress}/${state.fetchedIds.length})`)
                    : null
                )
              : e('button', {
                  onClick: handleStop,
                  style: { ...btnStyle, background: '#c43e3e', color: '#fff' },
                  onMouseEnter: (e) => e.target.style.background = '#d45555',
                  onMouseLeave: (e) => e.target.style.background = '#c43e3e'
                }, '■ Stop')
          ),

          // Logs
          e('div', {
            ref: logRef,
            style: {
              background: '#252525',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '220px',
              overflowY: 'auto',
              fontSize: '12px',
              fontFamily: 'Consolas, Monaco, monospace',
              color: '#d4d4d4',
              border: '1px solid #2a2a2a'
            }
          },
            state.logs.length === 0
              ? e('div', { style: { color: '#666', textAlign: 'center', padding: '20px', fontSize: '11px' } }, 'Log akan muncul di sini...')
              : state.logs.map((log, i) =>
                  e('div', {
                    key: i,
                    style: {
                      marginBottom: '4px',
                      color: log.type === 'error' ? '#e06c75' :
                             log.type === 'warning' ? '#e5c07b' :
                             log.type === 'success' ? '#98c379' : '#abb2bf',
                      fontSize: '11px'
                    }
                  },
                    e('span', { style: { color: '#5c6370', fontSize: '10px' } }, `[${log.time}] `),
                    log.msg
                  )
                )
          )
        )
      );
    };

    // Mount app
    const container = document.getElementById('rekognisi-validator-root') || (() => {
      const div = document.createElement('div');
      div.id = 'rekognisi-validator-root';
      document.body.appendChild(div);
      return div;
    })();

    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(RekognisiValidator));

    console.log('✅ Rekognisi Auto Validator siap digunakan!');
  }
})();
