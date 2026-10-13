// App Logic & State Orchestration - Versi 2.0 Super Seru!

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Controls
  initAudioControls();

  // 2. Tab Navigasi
  initTabs();

  // 3. Game Skripsi Slayer Aksi Tembak
  initArcadeGame();

  // 4. Roda Nasib Skripsi (Spin the Wheel)
  initWheelOfFate();

  // 5. Simulator Chat Dospem
  initChatSimulator();

  // 6. Gacha Kartu Motivasi
  initGacha();

  // 7. Ruang Tinju Revisi (Rage Room)
  initRageRoom();

  // 8. Ruang Ngetik Santai (Pomodoro & Todo)
  initFokusLab();

  // 9. Generator Sertifikat Calon Sarjana
  initCertificate();

  // 10. Efek Konfeti Warna-Warni
  initConfetti();

  // 11. Ticker Motivasi Berjalan
  initTicker();
});

// ===================================================================
// AUDIO CONTROLS
// ===================================================================
function initAudioControls() {
  const muteBtn = document.getElementById('btn-mute');
  const lofiBtn = document.getElementById('btn-lofi');
  const rainBtn = document.getElementById('btn-rain');

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      muteBtn.classList.toggle('active', !isMuted);
      const textElem = muteBtn.querySelector('.audio-text');
      if (textElem) {
        textElem.innerText = isMuted ? 'Suara Mati' : 'Suara Nyala';
      }
    });
  }

  if (lofiBtn) {
    lofiBtn.addEventListener('click', () => {
      const active = window.soundEngine.toggleLofi();
      lofiBtn.classList.toggle('active', active);
    });
  }

  if (rainBtn) {
    rainBtn.addEventListener('click', () => {
      const active = window.soundEngine.toggleRain();
      rainBtn.classList.toggle('active', active);
    });
  }
}

// ===================================================================
// NAVIGASI TAB
// ===================================================================
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const viewSections = document.querySelectorAll('.view-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      viewSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');

      if (window.soundEngine) window.soundEngine.playClick();
    });
  });
}

// ===================================================================
// GAME INTEGRATION (ACTION SHOOTER)
// ===================================================================
let gameInstance = null;

function initArcadeGame() {
  gameInstance = new SkripsiGame('game-canvas');

  const startBtn = document.getElementById('btn-start-game');
  const overlay = document.getElementById('game-start-overlay');
  const restartBtn = document.getElementById('btn-restart-game');
  const winRestartBtn = document.getElementById('btn-win-restart');
  const autoFireBtn = document.getElementById('btn-toggle-autofire');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (overlay) overlay.style.display = 'none';
      gameInstance.start();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      document.getElementById('game-over-modal').classList.add('hidden');
      gameInstance.start();
    });
  }

  if (winRestartBtn) {
    winRestartBtn.addEventListener('click', () => {
      document.getElementById('game-win-modal').classList.add('hidden');
      gameInstance.start();
    });
  }

  // Auto-Fire Toggle
  if (autoFireBtn) {
    autoFireBtn.addEventListener('click', () => {
      gameInstance.autoFire = !gameInstance.autoFire;
      autoFireBtn.classList.toggle('active', gameInstance.autoFire);
      autoFireBtn.innerText = gameInstance.autoFire ? 'AKTIF ⚡' : 'MANUAL ✋';
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  // Mobile Buttons
  const leftBtn = document.getElementById('touch-left');
  const rightBtn = document.getElementById('touch-right');
  const shootBtn = document.getElementById('touch-shoot');

  if (leftBtn && rightBtn) {
    const bindTouch = (elem, key) => {
      elem.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (gameInstance) gameInstance.keys[key] = true;
      });
      elem.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (gameInstance) gameInstance.keys[key] = false;
      });
      elem.addEventListener('mousedown', () => {
        if (gameInstance) gameInstance.keys[key] = true;
      });
      elem.addEventListener('mouseup', () => {
        if (gameInstance) gameInstance.keys[key] = false;
      });
    };

    bindTouch(leftBtn, 'left');
    bindTouch(rightBtn, 'right');
  }

  if (shootBtn) {
    shootBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (gameInstance) gameInstance.shootBullet();
    });
  }
}

// ===================================================================
// RODA NASIB SKRIPSI (SPIN THE WHEEL)
// ===================================================================
function initWheelOfFate() {
  const wheel = new WheelOfFate('wheel-canvas');
  const spinBtn = document.getElementById('btn-spin-wheel');
  const resultBanner = document.getElementById('wheel-result');
  const resultTitle = document.getElementById('wheel-result-title');
  const resultDesc = document.getElementById('wheel-result-desc');

  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      if (wheel.isSpinning) return;
      resultBanner.classList.remove('active');

      wheel.spin((prize) => {
        resultTitle.innerText = `${prize.icon} ${prize.text}`;
        resultDesc.innerText = prize.desc;
        resultBanner.classList.add('active');

        if (window.soundEngine) window.soundEngine.playLevelUp();
        if (window.fireConfetti) window.fireConfetti();
      });
    });
  }
}

// ===================================================================
// SIMULATOR CHAT DOSPEM (INTERACTIVE CHAT SCENARIOS)
// ===================================================================
function initChatSimulator() {
  let currentScenarioIndex = 0;
  const scenarios = window.CHAT_SCENARIOS || [];

  const avatarElem = document.getElementById('chat-dospem-avatar');
  const nameElem = document.getElementById('chat-dospem-name');
  const messagesBox = document.getElementById('chat-messages');
  const optionsBox = document.getElementById('chat-options');

  function renderScenario(index) {
    const sc = scenarios[index % scenarios.length];
    if (!sc || !messagesBox || !optionsBox) return;

    avatarElem.innerText = sc.avatar;
    nameElem.innerText = sc.sender;

    messagesBox.innerHTML = `
      <div class="chat-bubble bubble-dospem">
        ${sc.message}
      </div>
    `;

    optionsBox.innerHTML = '';
    sc.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-choice-btn';
      btn.innerText = opt.text;
      btn.addEventListener('click', () => handleChoice(opt, sc));
      optionsBox.appendChild(btn);
    });
  }

  function handleChoice(opt, sc) {
    if (window.soundEngine) window.soundEngine.playClick();

    // Student bubble
    const studentBubble = document.createElement('div');
    studentBubble.className = 'chat-bubble bubble-student';
    studentBubble.innerText = opt.text;
    messagesBox.appendChild(studentBubble);

    optionsBox.innerHTML = '<span style="font-size:0.85rem; color:#64748b; font-style:italic;">Dospem sedang mengetik... 💬</span>';

    setTimeout(() => {
      if (window.soundEngine) window.soundEngine.playPing();

      // Dospem reaction bubble
      const dospemReply = document.createElement('div');
      dospemReply.className = 'chat-bubble bubble-dospem';
      dospemReply.innerHTML = `
        ${opt.reaction}
        <div><span class="chat-score-badge">${opt.status} (+${opt.score} Poin)</span></div>
      `;
      messagesBox.appendChild(dospemReply);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      if (opt.score > 100 && window.fireConfetti) {
        window.fireConfetti();
      }

      // Next Scenario Button
      optionsBox.innerHTML = `
        <button id="btn-next-scenario" class="btn-cyber-primary" style="width:100%;">
          Lanjut Chat Berikutnya ⏭️
        </button>
      `;

      document.getElementById('btn-next-scenario').addEventListener('click', () => {
        currentScenarioIndex++;
        renderScenario(currentScenarioIndex);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    }, 1000);
  }

  renderScenario(0);
}

// ===================================================================
// GACHA KARTU SEMANGAT (3D TILT)
// ===================================================================
function initGacha() {
  const cardContainer = document.getElementById('gacha-card-container');
  const cardElem = document.getElementById('gacha-card');
  const draw1Btn = document.getElementById('btn-gacha-1x');
  const draw10Btn = document.getElementById('btn-gacha-10x');
  const copyBtn = document.getElementById('btn-copy-quote');
  const waBtn = document.getElementById('btn-share-wa');

  let currentCardData = window.getRandomQuote("SSR");
  renderCard(currentCardData);

  if (cardContainer) {
    cardContainer.addEventListener('mousemove', (e) => {
      const rect = cardContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 12;
      const rotY = (x / (rect.width / 2)) * 12;

      cardContainer.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    cardContainer.addEventListener('mouseleave', () => {
      cardContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  function renderCard(data) {
    currentCardData = data;
    cardElem.className = `holo-card rarity-${data.rarity}`;
    document.getElementById('card-rarity-text').innerText = data.rarity;
    document.getElementById('card-badge-text').innerText = data.badge;
    document.getElementById('card-main-text').innerText = `"${data.text}"`;
    document.getElementById('card-sub-text').innerText = data.subtext;
    document.getElementById('card-tag-text').innerText = data.tag;

    cardElem.style.transform = 'scale(0.95)';
    setTimeout(() => {
      cardElem.style.transform = 'scale(1)';
    }, 50);

    saveToGallery(data);
  }

  if (draw1Btn) {
    draw1Btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playGachaReveal();
      const card = window.drawGachaCard();
      renderCard(card);
      if (card.rarity === 'SSR' && window.fireConfetti) {
        window.fireConfetti();
      }
    });
  }

  if (draw10Btn) {
    draw10Btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playGachaReveal();
      let bestCard = null;
      const priority = { 'SSR': 4, 'SR': 3, 'RARE': 2, 'COMMON': 1 };

      for (let i = 0; i < 10; i++) {
        const c = window.drawGachaCard();
        saveToGallery(c);
        if (!bestCard || priority[c.rarity] > priority[bestCard.rarity]) {
          bestCard = c;
        }
      }

      renderCard(bestCard);
      if (bestCard.rarity === 'SSR' && window.fireConfetti) {
        window.fireConfetti();
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!currentCardData) return;
      const fullText = `${currentCardData.badge}\n\n"${currentCardData.text}"\n\n${currentCardData.subtext}\n${currentCardData.tag} ✨🎓`;
      navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.innerText = 'Tersalin! ✅';
        setTimeout(() => { copyBtn.innerText = '📋 Salin Teks'; }, 2000);
      });
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!currentCardData) return;
      const fullText = `*${currentCardData.badge}*\n\n"${currentCardData.text}"\n\n_${currentCardData.subtext}_\n\n${currentCardData.tag}\nSemangat skripsinya teman-teman, kita pasti bisa wisuda bareng! 🎓✨`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
      window.open(url, '_blank');
    });
  }

  loadGallery();
}

function saveToGallery(card) {
  try {
    let saved = JSON.parse(localStorage.getItem('skripsi_cards_gallery') || '[]');
    if (!saved.some(c => c.id === card.id)) {
      saved.unshift(card);
      if (saved.length > 24) saved.pop();
      localStorage.setItem('skripsi_cards_gallery', JSON.stringify(saved));
      renderGalleryItems(saved);
    }
  } catch (e) {}
}

function loadGallery() {
  try {
    let saved = JSON.parse(localStorage.getItem('skripsi_cards_gallery') || '[]');
    if (saved.length === 0 && window.QUOTES_DATABASE) {
      saved = window.QUOTES_DATABASE.slice(0, 6);
    }
    renderGalleryItems(saved);
  } catch (e) {}
}

function renderGalleryItems(cards) {
  const gallery = document.getElementById('quotes-gallery');
  if (!gallery) return;
  gallery.innerHTML = '';
  cards.forEach(c => {
    const el = document.createElement('div');
    el.className = 'mini-quote-card';
    el.innerHTML = `
      <div>
        <div class="mini-badge">${c.badge} [${c.rarity}]</div>
        <div class="mini-text">"${c.text}"</div>
      </div>
      <div class="mini-tag">${c.tag}</div>
    `;
    gallery.appendChild(el);
  });
}

// ===================================================================
// RUANG TINJU REVISI (RAGE ROOM)
// ===================================================================
function initRageRoom() {
  const target = document.getElementById('smash-target');
  const arena = document.getElementById('rage-arena');
  const countDisplay = document.getElementById('rage-smash-count');
  const rankDisplay = document.getElementById('rage-rank');
  const stressFill = document.getElementById('stress-fill');

  let totalSmashes = parseInt(localStorage.getItem('skripsi_rage_count') || '0');
  let currentStress = 0;
  const hitPunches = [
    "REVISI HILANG! 💥", "OVERTHINKING BYE! 🌪️", "TURNITIN TURUN! 📉",
    "PLONG BANGET! 💖", "MENTOK TERLEWATI! ✨", "BAB 4 AMAN! 🥊",
    "MENYALA TEMANKU! 🚀", "DOSPEM ACC! 🎉"
  ];

  updateDisplays();

  if (target && arena) {
    target.addEventListener('pointerdown', (e) => {
      totalSmashes++;
      currentStress += 5;
      if (currentStress > 100) currentStress = 100;

      localStorage.setItem('skripsi_rage_count', totalSmashes.toString());

      if (window.soundEngine) window.soundEngine.playSmash();

      const rect = arena.getBoundingClientRect();
      const p = document.createElement('div');
      p.className = 'hit-particle';
      p.innerText = hitPunches[Math.floor(Math.random() * hitPunches.length)];
      p.style.left = `${e.clientX - rect.left - 40}px`;
      p.style.top = `${e.clientY - rect.top - 20}px`;
      p.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
      arena.appendChild(p);

      setTimeout(() => p.remove(), 600);

      if (currentStress >= 100) {
        currentStress = 0;
        if (window.fireConfetti) window.fireConfetti();
        if (window.soundEngine) window.soundEngine.playLevelUp();
        alert("🎉 HOREEE! HATI KAMU UDAH PLONG & TENANG!\nSemua rasa kesel dan capek revisi udah berhasil kamu hempas! Sekarang tarik napas panjang, minum air dingin, kamu siap gas lagi!");
      }

      updateDisplays();
    });
  }

  function updateDisplays() {
    if (countDisplay) countDisplay.innerText = totalSmashes;
    if (stressFill) stressFill.style.width = `${currentStress}%`;

    let rank = "Mulai Melepas Beban";
    if (totalSmashes > 20) rank = "Hati Mulai Adem";
    if (totalSmashes > 60) rank = "Pembantai Typo Ceria";
    if (totalSmashes > 120) rank = "Pikiran Jernih Kembali";
    if (totalSmashes > 250) rank = "Sahabat Dospem Santuy";
    if (totalSmashes > 500) rank = "Zen Master Siap Wisuda 🎓";
    if (rankDisplay) rankDisplay.innerText = rank;
  }
}

// ===================================================================
// RUANG NGETIK SANTAI (POMODORO & TODO)
// ===================================================================
function initFokusLab() {
  const timerDisplay = document.getElementById('pomo-display');
  const startBtn = document.getElementById('btn-pomo-start');
  const resetBtn = document.getElementById('btn-pomo-reset');
  const workModeBtn = document.getElementById('btn-mode-work');
  const breakModeBtn = document.getElementById('btn-mode-break');

  let duration = 25 * 60;
  let remaining = duration;
  let timerInterval = null;
  let isRunning = false;

  function updateDisplay() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    if (timerDisplay) {
      timerDisplay.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.innerText = 'Mulai Ngetik ▶';
      } else {
        isRunning = true;
        startBtn.innerText = 'Jeda Dulu ⏸';
        timerInterval = setInterval(() => {
          remaining--;
          updateDisplay();
          if (remaining <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.innerText = 'Mulai Ngetik ▶';
            if (window.soundEngine) window.soundEngine.playLevelUp();
            if (window.fireConfetti) window.fireConfetti();
            alert("⏰ WAKTU NGETIK SELESAI!\nKeren banget kamu berhasil fokus 25 menit! Sekarang istirahat 5 menit dulu yuk sambil ngemil atau dengerin lagu.");
          }
        }, 1000);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
      clearInterval(timerInterval);
      isRunning = false;
      remaining = duration;
      if (startBtn) startBtn.innerText = 'Mulai Ngetik ▶';
      updateDisplay();
    });
  }

  if (workModeBtn && breakModeBtn) {
    workModeBtn.addEventListener('click', () => {
      workModeBtn.classList.add('active');
      breakModeBtn.classList.remove('active');
      duration = 25 * 60;
      remaining = duration;
      clearInterval(timerInterval);
      isRunning = false;
      if (startBtn) startBtn.innerText = 'Mulai Ngetik ▶';
      updateDisplay();
    });

    breakModeBtn.addEventListener('click', () => {
      breakModeBtn.classList.add('active');
      workModeBtn.classList.remove('active');
      duration = 5 * 60;
      remaining = duration;
      clearInterval(timerInterval);
      isRunning = false;
      if (startBtn) startBtn.innerText = 'Mulai Santai ▶';
      updateDisplay();
    });
  }

  updateDisplay();
  initTodo();
}

function initTodo() {
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('btn-add-todo');
  const list = document.getElementById('todo-list');

  let todos = JSON.parse(localStorage.getItem('skripsi_todos') || '[]');
  if (todos.length === 0) {
    todos = [
      { text: "Benerin latar belakang Bab 1", done: true },
      { text: "Cari 3 jurnal pendukung yang bagus", done: false },
      { text: "Ketik 2 halaman Bab 4", done: false },
      { text: "Bikin daftar pustaka rapi", done: false }
    ];
  }

  function saveAndRender() {
    localStorage.setItem('skripsi_todos', JSON.stringify(todos));
    if (!list) return;
    list.innerHTML = '';
    todos.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = `todo-item ${t.done ? 'done' : ''}`;
      item.innerHTML = `
        <div class="todo-left" data-index="${i}">
          <div class="todo-check">${t.done ? '✓' : ''}</div>
          <span>${t.text}</span>
        </div>
        <button class="todo-delete" data-index="${i}">✕</button>
      `;
      list.appendChild(item);
    });

    list.querySelectorAll('.todo-left').forEach(el => {
      el.addEventListener('click', () => {
        const idx = el.getAttribute('data-index');
        todos[idx].done = !todos[idx].done;
        if (window.soundEngine) window.soundEngine.playCollect();
        saveAndRender();
      });
    });

    list.querySelectorAll('.todo-delete').forEach(el => {
      el.addEventListener('click', () => {
        const idx = el.getAttribute('data-index');
        todos.splice(idx, 1);
        if (window.soundEngine) window.soundEngine.playClick();
        saveAndRender();
      });
    });
  }

  if (addBtn && input) {
    const addTodo = () => {
      const val = input.value.trim();
      if (val) {
        todos.push({ text: val, done: false });
        input.value = '';
        if (window.soundEngine) window.soundEngine.playClick();
        saveAndRender();
      }
    };
    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTodo();
    });
  }

  saveAndRender();
}

// ===================================================================
// GENERATOR SERTIFIKAT CALON SARJANA
// ===================================================================
function initCertificate() {
  const nameInput = document.getElementById('cert-input-name');
  const campusInput = document.getElementById('cert-input-campus');
  const degreeInput = document.getElementById('cert-input-degree');
  const mottoInput = document.getElementById('cert-input-motto');

  const previewName = document.getElementById('cert-preview-name');
  const previewCampus = document.getElementById('cert-preview-campus');
  const previewStatus = document.getElementById('cert-preview-status');
  const downloadBtn = document.getElementById('btn-download-cert');

  const updateCert = () => {
    const name = nameInput.value.trim() || "Nama Mahasiswa Hebat";
    const degree = degreeInput.value.trim() || "S.Kom";
    const campus = campusInput.value.trim() || "Universitas Indonesia";
    const motto = mottoInput.value.trim() || "LULUS DENGAN PUJIAN (CUMLAUDE)";

    previewName.innerText = `${name}, ${degree}`;
    previewCampus.innerText = campus;
    previewStatus.innerText = motto;
  };

  [nameInput, campusInput, degreeInput, mottoInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateCert);
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playLevelUp();
      if (window.fireConfetti) window.fireConfetti();
      exportCertificateAsImage();
    });
  }
}

function exportCertificateAsImage() {
  const name = (document.getElementById('cert-input-name').value.trim() || "Nama Mahasiswa") + ", " + (document.getElementById('cert-input-degree').value.trim() || "S.Kom");
  const campus = document.getElementById('cert-input-campus').value.trim() || "Universitas Impian";
  const status = document.getElementById('cert-input-motto')?.value || "LULUS DENGAN PUJIAN (CUMLAUDE)";

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, '#fffdf5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 800);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.strokeStyle = '#ff3385';
  ctx.lineWidth = 3;
  ctx.strokeRect(46, 46, 1108, 708);

  ctx.font = '72px "Segoe UI Emoji"';
  ctx.textAlign = 'center';
  ctx.fillText('🎓', 600, 150);

  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#d97706';
  ctx.fillText('SERTIFIKAT MANIFESTASI KELULUSAN RESMI', 600, 205);

  ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('CALON SARJANA HEBAT & MEMBANGGAKAN', 600, 260);

  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('DIBERIKAN DENGAN RASA BANGGA DAN APRESIASI KEPADA:', 600, 325);

  ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ff3385';
  ctx.fillText(name, 600, 395);

  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#0284c7';
  ctx.fillText(campus, 600, 445);

  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(380, 480, 440, 52);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(380, 480, 440, 52);

  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#b45309';
  ctx.fillText(status, 600, 514);

  ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('"Perjuangan dan lelahmu telah terbayar lunas. Selamat merayakan gelar barumu!"', 600, 600);

  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('DOSEN PEMBIMBING 1', 250, 675);
  ctx.fillText('DEWAN PENGUJI SIDANG', 950, 675);

  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('Prof. ACC Satu Kali, M.Kom', 250, 715);
  ctx.fillText('Dr. Penguji Ramah, Ph.D', 950, 715);

  const link = document.createElement('a');
  link.download = `Sertifikat_Sarjana_${name.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ===================================================================
// TICKER MOTIVASI
// ===================================================================
function initTicker() {
  const marquee = document.getElementById('ticker-content');
  if (!marquee || !window.QUOTES_DATABASE) return;

  const sampleQuotes = window.QUOTES_DATABASE.map(q => `💖 ${q.text} (${q.tag})`).join('    🌸    ');
  marquee.innerText = sampleQuotes;
}

// ===================================================================
// KONFETI WARNA-WARNI POP
// ===================================================================
function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.fireConfetti = function() {
    const colors = ['#ff3385', '#0284c7', '#f59e0b', '#10b981', '#ff4757', '#8b5cf6'];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        opacity: 1
      });
    }

    if (!animId) loop();
  };

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.opacity <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }
}
