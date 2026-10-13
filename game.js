// Skripsi Slayer 2.0: Action Shooter & Slasher Arcade Edition!
// Tembak laser pena 🖊️💥, hancurkan monster revisi, auto-fire, boss fight epik!

class SkripsiGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 600;
    this.height = 700;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Game State
    this.isRunning = false;
    this.isPaused = false;
    this.gameOver = false;
    this.hasWon = false;
    this.autoFire = true; // Auto-fire enabled for instant action!

    // Player stats
    this.player = {
      x: this.width / 2,
      y: this.height - 80,
      width: 48,
      height: 48,
      speed: 7.5,
      hp: 3,
      maxHp: 3,
      shieldTime: 0,
      feverTime: 0,
      tripleShotTime: 0,
      shootCooldown: 0
    };

    // Game stats
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.monstersDestroyed = 0;
    this.chapter = 1;
    this.chapterTitles = [
      "BAB 1: Latar Belakang & Masalah",
      "BAB 2: Teori & Tinjauan Pustaka",
      "BAB 3: Cara & Metode Penelitian",
      "BAB 4: Hasil & Pembahasan Keren",
      "BAB 5: Kesimpulan Akhir",
      "SIDANG SKRIPSI: DEWAN PENGUJI"
    ];

    // Objects
    this.bullets = [];
    this.items = [];
    this.monsters = [];
    this.particles = [];
    this.floatingTexts = [];
    this.spawnTimer = 0;
    this.spawnInterval = 45;

    // Boss state
    this.boss = null;
    this.bossDefeated = false;

    // Controls
    this.keys = { left: false, right: false, shoot: false };
    this.setupControls();

    this.shakeIntensity = 0;
    this.animId = null;
  }

  resizeCanvas() {
    const container = this.canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      const targetWidth = Math.min(rect.width - 32, 600);
      const ratio = 700 / 600;
      this.width = targetWidth;
      this.height = Math.min(window.innerHeight * 0.72, targetWidth * ratio);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        this.keys.shoot = true;
        this.shootBullet();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) this.keys.shoot = false;
    });

    const handleMove = (clientX) => {
      if (!this.isRunning || this.gameOver || this.hasWon) return;
      const rect = this.canvas.getBoundingClientRect();
      const touchX = clientX - rect.left;
      this.player.x = Math.max(this.player.width / 2, Math.min(this.width - this.player.width / 2, touchX));
    };

    this.canvas.addEventListener('mousemove', (e) => handleMove(e.clientX));
    this.canvas.addEventListener('pointerdown', (e) => {
      handleMove(e.clientX);
      this.shootBullet();
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
      e.preventDefault();
    }, { passive: false });
  }

  start() {
    this.resizeCanvas();
    this.isRunning = true;
    this.isPaused = false;
    this.gameOver = false;
    this.hasWon = false;
    this.score = 0;
    this.combo = 0;
    this.monstersDestroyed = 0;
    this.chapter = 1;
    this.player.hp = this.player.maxHp;
    this.player.x = this.width / 2;
    this.player.y = this.height - 70;
    this.player.shieldTime = 0;
    this.player.feverTime = 0;
    this.player.tripleShotTime = 0;
    this.bullets = [];
    this.items = [];
    this.monsters = [];
    this.particles = [];
    this.floatingTexts = [];
    this.boss = null;
    this.bossDefeated = false;

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();

    this.showHypeToast("AKSI TEMBAK REVISI!", "Tembak laser pena & hancurkan semua coretan merah!", "🚀");
    if (window.soundEngine) window.soundEngine.playLevelUp();
  }

  shootBullet() {
    if (!this.isRunning || this.player.shootCooldown > 0) return;
    this.player.shootCooldown = 12; // Cooldown frames

    if (this.player.tripleShotTime > 0) {
      // Triple Shot Laser Spread
      this.bullets.push(
        { x: this.player.x, y: this.player.y - 20, vx: 0, vy: -12, color: "#ff3385", icon: "🖊️" },
        { x: this.player.x - 14, y: this.player.y - 15, vx: -3, vy: -11, color: "#0284c7", icon: "🖊️" },
        { x: this.player.x + 14, y: this.player.y - 15, vx: 3, vy: -11, color: "#f59e0b", icon: "🖊️" }
      );
    } else {
      // Single Laser Pen
      this.bullets.push({
        x: this.player.x,
        y: this.player.y - 20,
        vx: 0,
        vy: -12,
        color: "#ff3385",
        icon: "🖊️"
      });
    }

    if (window.soundEngine) window.soundEngine.playShoot();
  }

  triggerScreenShake(amount = 8) {
    this.shakeIntensity = amount;
  }

  spawnFloatingText(text, x, y, color = "#ff3385") {
    this.floatingTexts.push({ text, x, y, vy: -2, opacity: 1, color, life: 50 });
  }

  spawnExplosion(x, y, color = "#ff3385", count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 5 + 2,
        color,
        life: 30,
        maxLife: 30
      });
    }
  }

  spawnEnemyOrItem() {
    const isBossPhase = this.chapter === 6;
    const isFever = this.player.feverTime > 0;
    const roll = Math.random();

    if (isFever) {
      // All Bonus in Fever
      this.spawnItem('acc');
      return;
    }

    if (isBossPhase) {
      if (roll < 0.4) this.spawnItem('argument');
      else this.spawnMonster('boss_bullet');
      return;
    }

    if (roll < 0.4) {
      // Spawn Collectible / Buff
      const itemRoll = Math.random();
      if (itemRoll < 0.35) this.spawnItem('coffee');
      else if (itemRoll < 0.65) this.spawnItem('journal');
      else if (itemRoll < 0.82) this.spawnItem('tripleshot');
      else if (itemRoll < 0.92) this.spawnItem('shield');
      else this.spawnItem('nuke');
    } else {
      // Spawn Destroyable Monster
      const monRoll = Math.random();
      if (monRoll < 0.5) this.spawnMonster('revisi');
      else if (monRoll < 0.8) this.spawnMonster('turnitin');
      else this.spawnMonster('overthinking');
    }
  }

  spawnItem(type) {
    const defs = {
      coffee: { icon: '🧋', name: 'Kopi Boba', exp: 80, color: '#f59e0b' },
      journal: { icon: '📚', name: 'Jurnal Scopus', exp: 150, color: '#0284c7' },
      tripleshot: { icon: '⚡', name: 'Triple Laser!', exp: 100, color: '#8b5cf6' },
      shield: { icon: '💖', name: 'Doa Ortu', exp: 120, color: '#ec4899' },
      acc: { icon: '🎓', name: 'Stempel ACC Emas', exp: 250, color: '#eab308' },
      nuke: { icon: '💣', name: 'Bom Turnitin 0%', exp: 300, color: '#ef4444' },
      argument: { icon: '💡', name: 'Argumen Mantap', exp: 200, color: '#10b981' }
    };

    const def = defs[type];
    const size = 38;
    const x = Math.random() * (this.width - size * 2) + size;
    this.items.push({
      x, y: -30, size, speed: 2.2 + Math.random() * 1.5, type, ...def
    });
  }

  spawnMonster(type) {
    const defs = {
      revisi: { icon: '📝', name: 'Coretan Merah', hp: 1, maxHp: 1, exp: 100, color: '#ef4444' },
      turnitin: { icon: '⚠️', name: 'Turnitin Tinggi', hp: 2, maxHp: 2, exp: 180, color: '#f97316' },
      overthinking: { icon: '🤯', name: 'Overthinking', hp: 2, maxHp: 2, exp: 200, color: '#d946ef' },
      boss_bullet: { icon: '❓', name: 'Tanya Menjebak', hp: 1, maxHp: 1, exp: 120, color: '#dc2626' }
    };

    const def = defs[type];
    const size = 44;
    const x = Math.random() * (this.width - size * 2) + size;
    const speed = 2.0 + Math.random() * 1.6 + (this.chapter * 0.3);
    this.monsters.push({
      x, y: -40, size, speed, type, ...def
    });
  }

  showHypeToast(title, desc, icon = "🎉") {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${desc}</div>
      </div>
    `;
    toast.classList.remove('hidden');
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  checkChapterProgress() {
    if (this.chapter >= 6) return;
    const target = this.chapter * 800;
    if (this.score >= target) {
      this.chapter++;
      if (window.soundEngine) window.soundEngine.playLevelUp();
      this.triggerScreenShake(12);
      this.spawnExplosion(this.width / 2, this.height / 3, "#ff3385", 35);

      if (this.chapter === 2) this.showHypeToast("ASIK! BAB 1 KELAR!", "Masuk Bab 2: Teori makin solid!", "📚");
      else if (this.chapter === 3) this.showHypeToast("MANTAP! BAB 2 SELESAI!", "Masuk Bab 3: Metode siap tempur!", "🔬");
      else if (this.chapter === 4) this.showHypeToast("KEREN! BAB 3 TUNTAS!", "Masuk Bab 4: Hasil penelitian menyala!", "🔥");
      else if (this.chapter === 5) this.showHypeToast("DIKIT LAGI! BAB 4 BERES!", "Masuk Bab 5: Kesimpulan rapi, siap sidang!", "🎓");
      else if (this.chapter === 6) this.initBossFight();
    }
  }

  initBossFight() {
    this.boss = {
      x: this.width / 2,
      y: 110,
      hp: 12,
      maxHp: 12,
      name: "SIDANG: DEWAN PENGUJI",
      direction: 1,
      speed: 2.5
    };
    this.showHypeToast("🎓 SAATNYA SIDANG SKRIPSI!", "Tembak pertanyaan penguji pake Laser Argumen!", "✨");
    this.triggerScreenShake(14);
  }

  update() {
    if (!this.isRunning || this.isPaused || this.gameOver || this.hasWon) return;

    // Movement
    if (this.keys.left) this.player.x -= this.player.speed;
    if (this.keys.right) this.player.x += this.player.speed;
    this.player.x = Math.max(this.player.width / 2, Math.min(this.width - this.player.width / 2, this.player.x));

    // Timers
    if (this.player.shieldTime > 0) this.player.shieldTime--;
    if (this.player.feverTime > 0) this.player.feverTime--;
    if (this.player.tripleShotTime > 0) this.player.tripleShotTime--;
    if (this.player.shootCooldown > 0) this.player.shootCooldown--;

    // Auto-fire
    if (this.autoFire && this.player.shootCooldown <= 0) {
      this.shootBullet();
    }

    // Spawn Enemies / Items
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEnemyOrItem();
    }

    // Boss logic
    if (this.boss && !this.bossDefeated) {
      this.boss.x += this.boss.speed * this.boss.direction;
      if (this.boss.x > this.width - 70 || this.boss.x < 70) {
        this.boss.direction *= -1;
      }
    }

    // Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      // Check hit with Boss
      if (this.boss && !this.bossDefeated) {
        const distToBoss = Math.hypot(b.x - this.boss.x, b.y - this.boss.y);
        if (distToBoss < 45) {
          this.boss.hp--;
          this.spawnExplosion(b.x, b.y, "#10b981", 10);
          this.spawnFloatingText("KENA ARGUMEN! 💥", b.x, b.y, "#10b981");
          this.triggerScreenShake(6);
          if (window.soundEngine) window.soundEngine.playExplosion();
          this.bullets.splice(i, 1);

          if (this.boss.hp <= 0) {
            this.winGame();
          }
          continue;
        }
      }

      // Check hit with Monsters
      let bulletHit = false;
      for (let j = this.monsters.length - 1; j >= 0; j--) {
        const m = this.monsters[j];
        const dist = Math.hypot(b.x - m.x, b.y - m.y);
        if (dist < m.size / 2 + 12) {
          m.hp--;
          bulletHit = true;
          this.spawnExplosion(b.x, b.y, m.color, 8);

          if (m.hp <= 0) {
            // Monster Destroyed!
            this.monstersDestroyed++;
            this.combo++;
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;
            const mult = Math.min(4, 1 + Math.floor(this.combo / 4) * 0.5);
            const gained = Math.round(m.exp * mult);
            this.score += gained;

            this.spawnFloatingText(`+${gained} HANCUR! 💥`, m.x, m.y, m.color);
            this.triggerScreenShake(6);
            if (window.soundEngine) window.soundEngine.playExplosion();

            // Chance to drop coffee / bonus
            if (Math.random() < 0.45) {
              this.spawnItem('coffee');
            }

            this.monsters.splice(j, 1);
            this.checkChapterProgress();
          } else {
            this.spawnFloatingText(`HIT!`, m.x, m.y, "#ffffff");
            if (window.soundEngine) window.soundEngine.playClick();
          }
          break;
        }
      }

      if (bulletHit) {
        this.bullets.splice(i, 1);
        continue;
      }

      if (b.y < -30) {
        this.bullets.splice(i, 1);
      }
    }

    // Update Items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.y += it.speed;

      const dist = Math.hypot(this.player.x - it.x, this.player.y - it.y);
      if (dist < this.player.width / 2 + it.size / 2) {
        // Collect Item!
        this.combo++;
        const mult = Math.min(4, 1 + Math.floor(this.combo / 4) * 0.5);
        const gained = Math.round(it.exp * mult);
        this.score += gained;

        if (it.type === 'shield') {
          this.player.shieldTime = 360;
          this.spawnFloatingText("DOA ORTU AKTIF! 💖", it.x, it.y, "#ec4899");
        } else if (it.type === 'acc') {
          this.player.feverTime = 300;
          this.spawnFloatingText("PESTA ACC EMAS! ✨", it.x, it.y, "#eab308");
          this.triggerScreenShake(8);
        } else if (it.type === 'tripleshot') {
          this.player.tripleShotTime = 420; // 7 seconds
          this.spawnFloatingText("TRIPLE LASER PEN! ⚡", it.x, it.y, "#8b5cf6");
          this.triggerScreenShake(6);
        } else if (it.type === 'nuke') {
          // Clear all monsters!
          this.spawnFloatingText("BOM TURNITIN 0%!! 💣", this.width / 2, this.height / 2, "#ef4444");
          this.triggerScreenShake(16);
          if (window.soundEngine) window.soundEngine.playExplosion();
          this.monsters.forEach(m => {
            this.spawnExplosion(m.x, m.y, m.color, 15);
            this.score += m.exp;
          });
          this.monsters = [];
        } else {
          this.spawnFloatingText(`+${gained} SEMANGAT!`, it.x, it.y, it.color);
        }

        if (window.soundEngine) window.soundEngine.playCollect();
        this.spawnExplosion(it.x, it.y, it.color, 12);
        this.items.splice(i, 1);
        this.checkChapterProgress();
        continue;
      }

      if (it.y > this.height + 50) {
        this.items.splice(i, 1);
      }
    }

    // Update Monsters
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const m = this.monsters[i];
      m.y += m.speed;

      // Hit Player
      const dist = Math.hypot(this.player.x - m.x, this.player.y - m.y);
      if (dist < this.player.width / 2 + m.size / 2 - 4) {
        if (this.player.shieldTime > 0 || this.player.feverTime > 0) {
          this.spawnFloatingText("TERLINDUNGI! 💖", m.x, m.y, "#ec4899");
          this.spawnExplosion(m.x, m.y, "#ec4899", 10);
          if (window.soundEngine) window.soundEngine.playCollect();
        } else {
          this.player.hp--;
          this.combo = 0;
          this.triggerScreenShake(14);
          this.spawnFloatingText(`ADUH! ${m.name} -1 HP`, m.x, m.y, "#ef4444");
          this.spawnExplosion(m.x, m.y, "#ef4444", 16);
          if (window.soundEngine) window.soundEngine.playHit();

          if (this.player.hp <= 0) {
            this.loseGame();
          }
        }
        this.monsters.splice(i, 1);
        continue;
      }

      if (m.y > this.height + 50) {
        this.monsters.splice(i, 1);
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life--;
      ft.opacity = ft.life / 50;
      if (ft.life <= 0) this.floatingTexts.splice(i, 1);
    }

    if (this.shakeIntensity > 0) {
      this.shakeIntensity *= 0.88;
      if (this.shakeIntensity < 0.2) this.shakeIntensity = 0;
    }

    this.updateUI();
  }

  updateUI() {
    const hpElem = document.getElementById('game-hp');
    const scoreElem = document.getElementById('game-score');
    const chapterElem = document.getElementById('game-chapter');
    const comboElem = document.getElementById('game-combo');

    if (hpElem) {
      let hearts = '';
      for (let i = 0; i < this.player.maxHp; i++) {
        hearts += i < this.player.hp ? '❤️ ' : '🤍 ';
      }
      hpElem.innerHTML = hearts;
    }
    if (scoreElem) scoreElem.innerText = `${this.score} Poin`;
    if (chapterElem) chapterElem.innerText = this.chapterTitles[this.chapter - 1];
    if (comboElem) {
      comboElem.innerText = this.combo > 1 ? `x${this.combo} KOMBO! ⭐` : '';
    }
  }

  winGame() {
    this.hasWon = true;
    this.bossDefeated = true;
    this.isRunning = false;
    if (window.soundEngine) window.soundEngine.playLevelUp();
    this.triggerScreenShake(20);
    this.spawnExplosion(this.width / 2, this.height / 2, "#f59e0b", 60);

    const winModal = document.getElementById('game-win-modal');
    if (winModal) {
      document.getElementById('win-score').innerText = `${this.score} Poin`;
      document.getElementById('win-items').innerText = `${this.monstersDestroyed} Monster Hancur`;
      winModal.classList.remove('hidden');
    }

    if (window.fireConfetti) window.fireConfetti();
  }

  loseGame() {
    this.gameOver = true;
    this.isRunning = false;
    const loseModal = document.getElementById('game-over-modal');
    if (loseModal) {
      document.getElementById('lose-score').innerText = `${this.score} Poin`;
      document.getElementById('lose-chapter').innerText = this.chapterTitles[this.chapter - 1];
      const randomQ = window.getRandomQuote ? window.getRandomQuote() : null;
      if (randomQ) {
        document.getElementById('lose-quote').innerText = `"${randomQ.text}"`;
      }
      loseModal.classList.remove('hidden');
    }
  }

  draw() {
    this.ctx.save();

    if (this.shakeIntensity > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.ctx.translate(sx, sy);
    }

    // Sky Background
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (this.player.feverTime > 0) {
      bgGrad.addColorStop(0, '#fdf4ff');
      bgGrad.addColorStop(1, '#fef9c3');
    } else {
      bgGrad.addColorStop(0, '#e0f2fe');
      bgGrad.addColorStop(1, '#fff7ed');
    }
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Grid
    this.ctx.strokeStyle = 'rgba(2, 132, 199, 0.08)';
    this.ctx.lineWidth = 1;
    const step = 45;
    for (let x = 0; x < this.width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Boss
    if (this.boss && !this.bossDefeated) {
      this.drawBoss();
    }

    // Draw Items
    this.items.forEach(it => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(it.x, it.y, it.size / 2 + 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = it.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();

      this.ctx.font = `${it.size - 8}px 'Segoe UI Emoji', sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(it.icon, it.x, it.y);

      this.ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = '#334155';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(it.name, it.x, it.y + it.size / 2 + 10);
      this.ctx.restore();
    });

    // Draw Monsters
    this.monsters.forEach(m => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.size / 2 + 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = m.color;
      this.ctx.shadowBlur = 12;
      this.ctx.fill();

      this.ctx.font = `${m.size - 8}px 'Segoe UI Emoji', sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(m.icon, m.x, m.y);

      // Monster HP indicator
      if (m.maxHp > 1) {
        this.ctx.fillStyle = 'rgba(0,0,0,0.15)';
        this.ctx.fillRect(m.x - 16, m.y - m.size / 2 - 8, 32, 5);
        this.ctx.fillStyle = m.color;
        this.ctx.fillRect(m.x - 16, m.y - m.size / 2 - 8, (m.hp / m.maxHp) * 32, 5);
      }

      this.ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = m.color;
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(m.name, m.x, m.y + m.size / 2 + 10);
      this.ctx.restore();
    });

    // Draw Bullets (Laser Pens!)
    this.bullets.forEach(b => {
      this.ctx.save();
      this.ctx.font = '22px "Segoe UI Emoji"';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(b.icon, b.x, b.y);
      this.ctx.restore();
    });

    // Draw Player
    this.drawPlayer();

    // Particles
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * (p.life / p.maxLife), 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });

    // Floating text
    this.floatingTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.opacity);
      this.ctx.font = 'bold 15px "Fredoka", sans-serif';
      this.ctx.fillStyle = ft.color;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    this.ctx.restore();
  }

  drawPlayer() {
    this.ctx.save();
    const px = this.player.x;
    const py = this.player.y;

    if (this.player.shieldTime > 0) {
      this.ctx.beginPath();
      this.ctx.arc(px, py, 40, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#ff3385';
      this.ctx.lineWidth = 3.5;
      this.ctx.shadowColor = '#ff3385';
      this.ctx.shadowBlur = 14;
      this.ctx.stroke();
    }

    if (this.player.tripleShotTime > 0) {
      this.ctx.beginPath();
      this.ctx.arc(px, py, 36, 0, Math.PI * 2);
      this.ctx.strokeStyle = '#8b5cf6';
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = '#8b5cf6';
      this.ctx.shadowBlur = 14;
      this.ctx.stroke();
    }

    // Base Glow Bubble
    this.ctx.beginPath();
    this.ctx.arc(px, py, 28, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = 'rgba(2, 132, 199, 0.3)';
    this.ctx.shadowBlur = 12;
    this.ctx.fill();

    this.ctx.font = '38px "Segoe UI Emoji", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🧑‍🎓', px, py);

    this.ctx.font = 'bold 11px "Fredoka", sans-serif';
    this.ctx.fillStyle = '#ff3385';
    this.ctx.shadowBlur = 0;
    this.ctx.fillText('PEJUANG', px, py + 30);

    this.ctx.restore();
  }

  drawBoss() {
    this.ctx.save();
    const bx = this.boss.x;
    const by = this.boss.y;

    this.ctx.font = 'bold 13px "Fredoka", sans-serif';
    this.ctx.fillStyle = '#d97706';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${this.boss.name} ⚖️`, bx, by - 42);

    const barW = 150;
    const barH = 12;
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.beginPath();
    this.ctx.roundRect(bx - barW / 2, by - 32, barW, barH, 6);
    this.ctx.fill();

    const fillW = Math.max(0, (this.boss.hp / this.boss.maxHp) * barW);
    const grad = this.ctx.createLinearGradient(bx - barW / 2, 0, bx + barW / 2, 0);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(1, '#ff3385');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.roundRect(bx - barW / 2, by - 32, fillW, barH, 6);
    this.ctx.fill();

    this.ctx.font = '48px "Segoe UI Emoji", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('👨‍🏫', bx, by);

    this.ctx.restore();
  }

  loop() {
    this.update();
    this.draw();
    if (this.isRunning) {
      this.animId = requestAnimationFrame(() => this.loop());
    }
  }
}

window.SkripsiGame = SkripsiGame;
