// Minigames Ekstra Seru: Roda Nasib Skripsi, Simulator Chat Dospem, & Soundboard Meme!

// ===================================================================
// 1. RODA NASIB SKRIPSI (SPIN THE WHEEL)
// ===================================================================
class WheelOfFate {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.size = 380;
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    this.slices = [
      { text: "ACC BAB 1-5!", color: "#ff3385", icon: "🎓", desc: "Keajaiban dunia! Dospem lagi bahagia banget!" },
      { text: "Boba Gratis!", color: "#0284c7", icon: "🧋", desc: "Rezeki anak sholeh, otak langsung adem!" },
      { text: "Revisi Typo Doang", color: "#f59e0b", icon: "📝", desc: "Cuma benerin titik koma, 5 menit kelar!" },
      { text: "Jurnal Scopus Pas", color: "#10b981", icon: "📚", desc: "Dapet referensi yang persis sama judulmu!" },
      { text: "Bebas Rebahan!", color: "#8b5cf6", icon: "🏖️", desc: "Hari ini dilarang pusing, nonton film dulu!" },
      { text: "Kopi Gula Aren", color: "#ec4899", icon: "☕", desc: "Energi turbo buat ngetik 3 halaman malam ini!" },
      { text: "Doa Tembus Langit", color: "#ffb703", icon: "✨", desc: "Jalan skripsimu dimudahkan semesta!" },
      { text: "Gacha SSR Gratis", color: "#06b6d4", icon: "🎁", desc: "Kartu motivasi terkuat menantimu!" }
    ];

    this.currentRotation = 0;
    this.isSpinning = false;
    this.draw();
  }

  draw() {
    const center = this.size / 2;
    const radius = center - 16;
    const sliceAngle = (Math.PI * 2) / this.slices.length;

    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.save();
    this.ctx.translate(center, center);
    this.ctx.rotate(this.currentRotation);

    // Draw Slices
    this.slices.forEach((slice, i) => {
      const angle = i * sliceAngle;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = slice.color;
      this.ctx.fill();
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Text & Icon
      this.ctx.save();
      this.ctx.rotate(angle + sliceAngle / 2);
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      this.ctx.fillText(`${slice.icon} ${slice.text}`, radius - 20, 5);
      this.ctx.restore();
    });

    this.ctx.restore();

    // Center Golden Hub
    this.ctx.beginPath();
    this.ctx.arc(center, center, 24, 0, Math.PI * 2);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.shadowColor = "rgba(0,0,0,0.2)";
    this.ctx.shadowBlur = 10;
    this.ctx.fill();
    this.ctx.font = "20px 'Segoe UI Emoji'";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("⭐", center, center);

    // Indicator Arrow (Right side)
    this.ctx.beginPath();
    this.ctx.moveTo(this.size - 10, center);
    this.ctx.lineTo(this.size - 32, center - 14);
    this.ctx.lineTo(this.size - 32, center + 14);
    this.ctx.closePath();
    this.ctx.fillStyle = "#ff3385";
    this.ctx.fill();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  spin(onResult) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const extraSpins = 5 + Math.random() * 5;
    const targetSlice = Math.floor(Math.random() * this.slices.length);
    const sliceAngle = (Math.PI * 2) / this.slices.length;
    const targetAngle = (Math.PI * 2 * extraSpins) - (targetSlice * sliceAngle) - (sliceAngle / 2);

    let currentSpeed = 0.35 + Math.random() * 0.15;
    const friction = 0.985;
    let lastTickAngle = this.currentRotation;

    const animate = () => {
      this.currentRotation += currentSpeed;
      currentSpeed *= friction;

      // Play tick sound every slice
      if (Math.abs(this.currentRotation - lastTickAngle) > sliceAngle) {
        if (window.soundEngine) window.soundEngine.playWheelTick();
        lastTickAngle = this.currentRotation;
      }

      this.draw();

      if (currentSpeed > 0.002) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        const normalized = (Math.PI * 2 - (this.currentRotation % (Math.PI * 2))) % (Math.PI * 2);
        const index = Math.floor(normalized / sliceAngle) % this.slices.length;
        const prize = this.slices[index];
        if (onResult) onResult(prize);
      }
    };

    animate();
  }
}

// ===================================================================
// 2. SIMULATOR CHAT DOSPEM (INTERACTIVE CHAT MINI-GAME)
// ===================================================================
const CHAT_SCENARIOS = [
  {
    id: 1,
    sender: "Prof. Bambang (Dospem 1)",
    avatar: "👨‍🏫",
    message: "Mas/Mbak, bab 3 kamu saya baca kemarin. Ada beberapa metode yang perlu disesuaikan. Besok jam 07.00 pagi bisa ke ruangan saya?",
    options: [
      {
        text: "Siap Prof, jam 06.45 saya sudah di depan ruangan!",
        reaction: "Bagus, saya suka mahasiswa yang sigap dan berdedikasi. Besok kita kupas sampai tuntas ya!",
        status: "Dospem Respect +100! 🌟",
        score: 150
      },
      {
        text: "Waduh Prof, gerbang kosan saya baru dibuka jam 8 pagi...",
        reaction: "Lho? Kan bisa panjat pagar demi masa depan skripsi kamu, hehehe.",
        status: "Dospem Heran tapi Ketawa wkwk 😂",
        score: 80
      },
      {
        text: "P (Cuma bales huruf P doang)",
        reaction: "Kamu sopan sekali ya... Nilai bimbingan saya pertimbangkan lagi.",
        status: "Kena Mental Dosen! Jangan ditiru ya wkwk 💀",
        score: -50
      }
    ]
  },
  {
    id: 2,
    sender: "Dr. Sri Rahayu (Dospem 2)",
    avatar: "👩‍🏫",
    message: "Saya cek Turnitin naskah kamu ada di angka 38%. Mohon diturunkan sampai maksimal 20% ya sebelum saya tanda tangan ACC.",
    options: [
      {
        text: "Siap Ibu! Malam ini langsung saya parafrase ulang dengan bahasa sendiri.",
        reaction: "Mantap! Gunakan sinonim yang tepat dan jangan lupa sitasi aslinya ya.",
        status: "Jalur Menuju ACC Terbuka Lebar! 🚀",
        score: 150
      },
      {
        text: "Ibu, itu yang plagiat kayaknya kutipan ayat suci sama undang-undang deh...",
        reaction: "Iya makanya disaring bagian yang ga perlu masuk kutipan langsung, pintar!",
        status: "Diskusi Ilmiah Berhasil! 💡",
        score: 100
      },
      {
        text: "Gimana kalo Turnitin-nya yang saya nego Bu?",
        reaction: "Kamu ini mahasiswa atau pedagang pasar tanah abang? Kerjakan!",
        status: "Kena Semprot Santuy wkwk 😭",
        score: 20
      }
    ]
  },
  {
    id: 3,
    sender: "Prof. Bambang (Dospem 1)",
    avatar: "👨‍🏫",
    message: "Naskah revisi Bab 4 dan 5 yang kemarin sudah saya periksa. Secara keseluruhan analisisnya sudah sangat bagus dan menjawab rumusan masalah.",
    options: [
      {
        text: "Alhamdulillah! Berarti sudah bisa daftar sidang skripsi ya Prof?",
        reaction: "Bisa! Segera print form persetujuan, besok saya tanda tangani langsung!",
        status: "TIKET SIDANG WISUDA DIAMANKAN!! 🎉🎓",
        score: 300
      },
      {
        text: "Terima kasih banyak Prof atas bimbingan sabarnya selama ini!",
        reaction: "Sama-sama. Kamu mahasiswa yang tekun. Siapkan mental buat presentasi ya!",
        status: "Dospem Bangga Sama Kamu! 💖",
        score: 250
      },
      {
        text: "Prof ga lagi nge-prank saya kan?",
        reaction: "Sejak kapan saya jadi YouTuber prank? Beneran ini!",
        status: "Resmi ACC Bebas Curiga! 🤣",
        score: 120
      }
    ]
  }
];

window.WheelOfFate = WheelOfFate;
window.CHAT_SCENARIOS = CHAT_SCENARIOS;
