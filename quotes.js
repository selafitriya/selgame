// Koleksi Kata-Kata Penyemangat Asik & Ceria Buat Pejuang Skripsi

const QUOTES_DATABASE = [
  // === KARTU SPESIAL (SSR - PALING BIKIN SEMANGAT) ===
  {
    id: 1,
    rarity: "SSR",
    badge: "🔥 MENYALA TEMANKU",
    text: "Kamu udah lewatin 7 semester kuliah yang nano-nano rasanya. Masa mau nyerah cuma gara-gara Bab 4? Bangkit dong, kamu itu tokoh utama di hidup kamu!",
    subtext: "Dikit lagi sarjana, yuk bisa yuk ketik 1 halaman hari ini!",
    tag: "#YukBisaYuk #GasKetik"
  },
  {
    id: 2,
    rarity: "SSR",
    badge: "🎓 TOGA MENANTIMU",
    text: "Toga wisuda kamu udah nungguin! Kebayang ga senyum bangga orang tua kamu pas kamu naik panggung wisuda? Rasa capek sekarang bakal lunas terbayar!",
    subtext: "Biar outfit wisuda yang udah kamu incer bisa langsung dipake foto-foto!",
    tag: "#BismillahWisuda #PastiBisa"
  },
  {
    id: 3,
    rarity: "SSR",
    badge: "✨ RAHASIA SUKSES",
    text: "Inget ya: Skripsi yang bagus itu BUKAN skripsi yang sempurna di angan-angan, tapi SKRIPSI YANG SELESAI DAN DI-ACC! Tulis aja dulu yang ada di pikiranmu!",
    subtext: "Done is better than perfect. Selesaiin dulu baru rapihin!",
    tag: "#TulisAjaDulu #AntiPusing"
  },
  {
    id: 4,
    rarity: "SSR",
    badge: "☕ SANTAI BESTIE",
    text: "Albert Einstein aja ga pernah ngerjain skripsi yang margin-nya 4-4-3-3 pake Times New Roman spasi 1.5. Jadi secara ga langsung, kamu tuh sakti banget!",
    subtext: "Format udah bener, tinggal substansinya kamu sikat pelan-pelan.",
    tag: "#KamuHebat #PejuangSkripsi"
  },
  {
    id: 5,
    rarity: "SSR",
    badge: "🌸 JANGAN INSECURE",
    text: "Temen kamu udah semhas atau sidang duluan? Santai aja, rezeki dan waktu tiap orang beda-beda. Bunga matahari sama bunga mawar ga mekar barengan, tapi sama-sama cantik!",
    subtext: "Fokus ke jalan kamu sendiri, kamu ga lagi balapan sama siapapun.",
    tag: "#PelanTapiPasti #SemangatTerus"
  },
  {
    id: 6,
    rarity: "SSR",
    badge: "🎉 BAYANGIN RASANYA",
    text: "Bayangin pas nama kamu dipanggil, keluar dari ruang sidang terus bilang: 'ALHAMDULILLAH LULUS!'. Rasanya bener-bener kayak lepas dari beban hidup 1 ton!",
    subtext: "Rasa plong itu tinggal beberapa lembar revisi lagi di depan kamu.",
    tag: "#ManifestingACC #BebasSkripsi"
  },

  // === KARTU SERU (SR - MOOD BOOSTER) ===
  {
    id: 7,
    rarity: "SR",
    badge: "🧋 REHAT SEJENAK",
    text: "Kalo otak kamu lagi mentok dan berasap, istirahat dulu! Beli es kopi atau boba kesukaan kamu, nonton video lucu, tidur 30 menit. Tapi abis itu lanjut lagi yaa!",
    subtext: "Sayangi diri kamu, otak juga butuh di-recharge kayak baterai HP.",
    tag: "#SelfCare #RechargeDulu"
  },
  {
    id: 8,
    rarity: "SR",
    badge: "📝 DOSPEM ITU MANUSIA",
    text: "Dosen pembimbing kamu dapet coretan merah? Santuyy, itu bukan berarti kamu bodoh! Dosen kamu cuma pengen tulisan kamu makin rapi. Senyumin, benerin dikit, kirim balik!",
    subtext: "Anggap aja revisi itu lagi dandanin naskah biar makin cantik.",
    tag: "#AntiBaper #DospemBaik"
  },
  {
    id: 9,
    rarity: "SR",
    badge: "📱 TUTUP SOSMED BENTAR",
    text: "Tutup dulu TikTok sama Instagram Reels kamu ya manis. Scroll 2 jam ga bakal bikin daftar pustaka keisi otomatis. 25 menit fokus ngetik dulu, abis itu bebas rebahan!",
    subtext: "Satu paragraf sekarang = satu langkah lebih deket ke wisuda.",
    tag: "#FokusBentar #PastiKelar"
  },
  {
    id: 10,
    rarity: "SR",
    badge: "💪 UDAH SEJAUH INI",
    text: "Kamu udah lewatin ospek, praktikum pagi buta, ujian susah, dan tugas kelompok yang bikin emosi. Masa skripsi doang bikin kamu ciut? Kamu jauh lebih kuat dari yang kamu kira!",
    subtext: "Tepuk pundak sendiri, bangga sama perjuangan kamu sampe hari ini.",
    tag: "#BanggaSamaKamu #MentalBaja"
  },
  {
    id: 11,
    rarity: "SR",
    badge: "🎯 SATU PER SATU",
    text: "Gak usah mikirin sidang dulu kalo bikin pusing! Targetin satu subbab hari ini aja. Kalo keberatan, targetin ngetik 2 paragraf dulu. Yang penting gerak!",
    subtext: "Langkah kecil tiap hari bakal jadi hasil besar di akhir bulan.",
    tag: "#LangkahKecil #FokusHariIni"
  },
  {
    id: 12,
    rarity: "SR",
    badge: "💡 OVERTHINKING HILANG",
    text: "Mikirin 'gimana ya kalo gagal' ga bikin skripsi kamu selesai. Yang bikin selesai itu buka laptop dan ketik kalimat pertama. Yuk mulai klik tombol Word kamu!",
    subtext: "Gausah takut salah, yang salah masih bisa diedit daripada ga nulis apa-apa.",
    tag: "#MulaiAjaDulu #KetikAja"
  },

  // === KARTU HARI-HARI (RARE - TEMAN CURHAT) ===
  {
    id: 13,
    rarity: "RARE",
    badge: "🌈 HARI BARU",
    text: "Napas dalem-dalem... Hembusin pelan-pelan. Lemesin bahu kamu yang kaku. Kamu lagi berjuang buat masa depan kamu yang cerah!",
    subtext: "Semesta lagi nyiapin hal-hal baik buat kamu.",
    tag: "#PelukHangat #TenangAja"
  },
  {
    id: 14,
    rarity: "RARE",
    badge: "🎈 JANGAN DROP OUT",
    text: "Uang kuliah udah keluar banyak, masa ga jadi wisuda? Outfit udah dipikirin, temen-temen udah siap bawain bunga sama hadiah. Jangan nyerah sekarang!",
    subtext: "Sayang banget kalo berhenti di garis finish.",
    tag: "#DikitLagi #WisudaTahunIni"
  },
  {
    id: 15,
    rarity: "RARE",
    badge: "📑 TURNITIN SANTUY",
    text: "Angka Turnitin tinggi? Gak usah panik, tinggal ubah kata-katanya pake bahasa sendiri (parafrase). Anggap aja kamu lagi cerita ulang ke temen sebangku!",
    subtext: "Trik jitu: ceritain pake gaya bahasamu sendiri.",
    tag: "#ParafraseSantai #TurnitinAman"
  },
  {
    id: 16,
    rarity: "RARE",
    badge: "🌟 KAMU BERHARGA",
    text: "Nilai diri kamu ga ditentukan sama seberapa cepet kamu lulus, tapi seberapa gigih kamu bangkit pas lagi capek. Kamu keren banget udah bertahan sejauh ini!",
    subtext: "Keep shining, calon sarjana hebat!",
    tag: "#SelfLove #TetapSemangat"
  },
  {
    id: 17,
    rarity: "RARE",
    badge: "☕ KOPI DAN LAGU",
    text: "Nyalain lagu santai di tab sebelah, pasang timer 25 menit, seduh teh atau kopi hangat. Skripsian bisa se-cozy ini kok kalo dinikmati!",
    subtext: "Bikin suasana ngetik jadi tempat paling nyaman.",
    tag: "#VibeNyaman #NgetikSantai"
  },
  {
    id: 18,
    rarity: "RARE",
    badge: "🏆 GELAR BARU",
    text: "Bentar lagi nama kamu di kartu nama dan LinkedIn bakal nambah gelar resmi! Pas ditanya 'Lagi sibuk apa?' kamu bisa jawab bangga: 'Udah lulus nih!'.",
    subtext: "Status mahasiswa akhir bentar lagi tamat!",
    tag: "#OfficiallyGraduated #MenujuGelar"
  },

  // === KARTU INSTAN (COMMON - SHOT SEMANGAT) ===
  {
    id: 19,
    rarity: "COMMON",
    badge: "⚡ SENGGOL SEMANGAT",
    text: "Hari ini revisi 1 halaman, besok 1 halaman. Tau-tau udah jilid naskah cover hijau bertinta emas!",
    subtext: "Progres kecil tetep progres!",
    tag: "#SatuHalamanSehari"
  },
  {
    id: 20,
    rarity: "COMMON",
    badge: "⚡ SENGGOL SEMANGAT",
    text: "Jangan nunggu 'mood' dateng. Mood itu bakal dateng setelah kamu mulai ngetik kalimat pertama!",
    subtext: "Mulai dari satu kata sekarang.",
    tag: "#AksiNyata"
  },
  {
    id: 21,
    rarity: "COMMON",
    badge: "⚡ SENGGOL SEMANGAT",
    text: "Skripsi_Final_Beneran_Fix_BismillahACC.docx adalah bukti nyata perjuangan hidup kamu!",
    subtext: "Versi terakhir bakal jadi versi ACC!",
    tag: "#FileLegenda"
  },
  {
    id: 22,
    rarity: "COMMON",
    badge: "⚡ SENGGOL SEMANGAT",
    text: "Minum air putih dulu yuk manis, biar otak kamu ga dehidrasi dan bisa mikir jernih lagi!",
    subtext: "Sehat dulu baru revisi.",
    tag: "#StayHydrated"
  }
];

// Helper buat dapetin quote acak
function getRandomQuote(minRarity = null) {
  let pool = QUOTES_DATABASE;
  if (minRarity) {
    if (minRarity === "SSR") pool = QUOTES_DATABASE.filter(q => q.rarity === "SSR");
    else if (minRarity === "SR") pool = QUOTES_DATABASE.filter(q => q.rarity === "SSR" || q.rarity === "SR");
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Gacha draw function
function drawGachaCard() {
  const rand = Math.random() * 100;
  let pool;
  let rarity;

  if (rand < 15) { // 15% SSR
    rarity = "SSR";
    pool = QUOTES_DATABASE.filter(q => q.rarity === "SSR");
  } else if (rand < 45) { // 30% SR
    rarity = "SR";
    pool = QUOTES_DATABASE.filter(q => q.rarity === "SR");
  } else if (rand < 75) { // 30% RARE
    rarity = "RARE";
    pool = QUOTES_DATABASE.filter(q => q.rarity === "RARE");
  } else { // 25% COMMON
    rarity = "COMMON";
    pool = QUOTES_DATABASE.filter(q => q.rarity === "COMMON");
  }

  const card = pool[Math.floor(Math.random() * pool.length)];
  return { ...card, rolledRarity: rarity };
}

window.QUOTES_DATABASE = QUOTES_DATABASE;
window.getRandomQuote = getRandomQuote;
window.drawGachaCard = drawGachaCard;
