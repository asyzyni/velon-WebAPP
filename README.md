# 🚗 Velon Car Rental

> Platform rental mobil full-stack yang menyederhanakan proses reservasi kendaraan bagi pelanggan dan mengoptimalkan manajemen armada secara real-time bagi penyedia rental.


---

## 1. Overview
- **Apa proyek ini?**  
  **Velon Car Rental** adalah aplikasi web full-stack *end-to-end* yang dirancang untuk mendigitalkan seluruh ekosistem bisnis rental mobil. Aplikasi ini menyediakan dua antarmuka terintegrasi: portal pelanggan untuk mencari dan mereservasi mobil secara instan, serta panel admin data-driven untuk memonitor ketersediaan armada, jadwal serah-terima harian, dan verifikasi transaksi pembayaran.

- **Masalah apa yang coba diselesaikan?**  
  1. **Bagi Pelanggan:** Ketidakpastian ketersediaan armada mobil, proses reservasi manual yang lambat via pesan teks, serta minimnya transparansi harga dan status konfirmasi sewa.
  2. **Bagi Pemilik Bisnis/Admin:** Rentannya terjadi jadwal tumpang tindih (*double booking*), kesulitan memantau armada yang sedang disewa atau harus kembali hari ini, serta rekapitulasi data pendapatan dan bukti transfer yang masih tercecer.

- **Siapa target penggunanya?**  
  - **Pelanggan Umum & Wisatawan:** Individu atau keluarga yang membutuhkan kendaraan sewaan dengan kepastian jadwal dan transparansi unit.
  - **Pemilik & Staf Operasional Rental:** Pengelola armada yang membutuhkan visibilitas jadwal kendaraan (*fleet schedule*), monitoring unit aktif, dan validasi transaksi dalam satu dashboard terpadu.

---

## 2. Konteks & Latar Belakang
- **Kapan & Di Mana:**  
  Proyek ini berawal dari penugasan studi kasus rekayasa perangkat lunak berbasis tim (*coursework challenge*) pada **Desember 2025 – Januari 2026** untuk membangun fondasi sistem (Versi 1). Kemudian, saya menginisiasi pembaruan mandiri (*solo iteration*) pada **September 2026** (Versi 2) untuk merombak arsitektur antarmuka, menyematkan visualisasi jadwal armada, dan memperkuat keandalan penanganan data.
- **Durasi Pengerjaan:**  
  Sekitar **5 minggu** secara akumulatif (3 minggu pengembangan MVP dasar bersama tim + 2 minggu refactoring arsitektur, UI redesign, dan pembuatan *Gantt Fleet Calendar* secara mandiri).
- **Individu atau Tim:**  
  Dikerjakan dalam tim beranggotakan **4 orang** pada fase awal (dengan pembagian peran backend, frontend, perancangan UI, dan pengujian). Pada fase lanjutan (Versi 2), saya memimpin refaktorisasi arsitektur sistem secara menyeluruh.

---

## 3. Peran & Tanggung Jawab Saya
Sebagai **Lead Full-Stack Developer & System Architect**, saya bertanggung jawab atas perancangan arsitektur perangkat lunak dari hulu ke hilir:

- **Arsitektur & Pengembangan Backend (Spring Boot + PostgreSQL):**
  - Merancang struktur RESTful API modular berbasis OOP (Controller, Service, DAO, DTO, Entity).
  - Mengimplementasikan logika inti booking: validasi ketersediaan mobil dinamis (*date collision handling*), kalkulasi harga sewa otomatis, mekanisme penjadwalan ulang (*reschedule*), dan pembatalan sewa.
  - Membangun autentikasi berbasis sesi (*session-based authentication*) dan *Role-Based Access Control* (USER vs ADMIN) dengan enkripsi kata sandi.
  - Menangani *multipart file upload* untuk sistem pengunggahan dan validasi bukti pembayaran.

- **Pengembangan Frontend & Desain Interaksi (React 19, TypeScript, Tailwind CSS):**
  - Mengembangkan antarmuka responsif untuk katalog mobil, alur pemesanan interaktif, dan riwayat reservasi pelanggan.
  - Merancang dan membangun fitur unggulan **Interactive Fleet Schedule (Jadwal Gantt-Style Calendar)** pada panel admin untuk memvisualisasikan seluruh jadwal booking armada dalam rentang bulanan.
  - Membangun dashboard analitik ringkas yang menyajikan metrik operasional harian (*Mobil Tersedia, Sedang Disewa, Diambil Hari Ini, Dikembalikan Hari Ini*) serta perbandingan pertumbuhan pendapatan bulanan (*Month-over-Month Revenue*).

- **Keputusan Penting yang Diambil:**
  1. **Memilih Arsitektur Terpisah (*Decoupled Client-Server*):** Memilih kombinasi React SPA dan Spring Boot REST API alih-alih Server-Side Rendering (Thymeleaf) agar interaksi pengguna terasa instan, minim reload, dan siap diekspansi ke aplikasi mobile (iOS) di masa depan.
  2. **Menghapus Redundansi UX Admin:** Mengganti tab "Kelola Booking" berbasis tabel biasa dan memusatkan seluruh aksi manajerial (*Approve, Complete, Cancel*) langsung ke dalam panel *drawer* interaktif di dalam kalender jadwal armada. Keputusan ini memangkas waktu kerja admin dan mengurangi kebingungan navigasi.
  3. **Isolasi Logika Penanggalan Murni (*Custom Date Parser*):** Mengatasi isu laten pergeseran tanggal akibat zona waktu (UTC *off-by-one bug*) dengan menulis pustaka helper tanggal mandiri di frontend (`parseISODate`), memastikan data tanggal yang dipilih pelanggan selalu presisi sesuai kalender lokal.

---

## 4. Proses
- **Inisiasi & Riset Kebutuhan:**  
  Proyek diawali dengan memetakan titik masalah (*pain points*) pada alur sewa mobil konvensional. Kami menemukan bahwa friksi terbesar ada pada konfirmasi tanggal: admin sering terlambat merespons ketersediaan unit karena harus mencocokkan catatan manual, yang kerap berujung pada pembatalan sepihak atau *double booking*.

- **Tools & Metodologi:**  
  - **Manajemen Proyek & Kolaborasi:** Git dengan branching strategy (`version-1`, `version-2`), sprint berkala, dan code review.
  - **Desain & Prototyping:** Wireframing alur reservasi dan tata letak dashboard di Figma.
  - **Stack Teknis:** Java Spring Boot, Spring Data JPA, PostgreSQL, React 19, TypeScript, Vite, Tailwind CSS, Radix UI.

- **Tantangan Utama & Solusi:**
  - *Tantangan 1: Pencegahan Bentrok Jadwal (Date Overlap Validation).*  
    *Solusi:* Merancang query validasi ketersediaan di JPA repository yang memeriksa tumpang tindih tanggal (`startDate <= newEndDate AND endDate >= newStartDate`) untuk status reservasi aktif (`CONFIRMED` / `WAITING_PAYMENT`). Unit mobil otomatis terkunci jika tanggal yang diminta beririsan dengan pesanan lain.
  - *Tantangan 2: Visualisasi Jadwal Armada Tanpa Library Berat.*  
    *Solusi:* Dibandingkan menggunakan library kalender monolitik pihak ketiga yang sulit dikustomisasi, saya merancang sendiri komponen Gantt timeline horizontal dari nol menggunakan CSS Grid dan date utility lokal. Hal ini menghasilkan performa render yang ringan, mulus, dan fleksibel terhadap status sewa.
  - *Tantangan 3: Tampilan Pecah Saat Browser Zooming.*  
    *Solusi:* Pada pengujian zoom 150%–200%, badge status tabel mengalami distorsi teks (*word wrap* dua baris). Saya menstandarkan utility class (`whitespace-nowrap`, `inline-flex`, dan kontainer scroll `min-w-[560px]`) di seluruh tabel admin dan riwayat pelanggan sehingga tampilan tetap rapi pada berbagai ukuran layar.

- **Iterasi Penting (Versi 1 vs Versi 2):**  
  - *Versi 1:* MVP dasar dengan fokus utama pemenuhan fungsionalitas CRUD dan konsep Pemrograman Berorientasi Objek (PBO).
  - *Versi 2:* Refaktorisasi besar pada arsitektur frontend: migrasi ke React 19 + TypeScript modern, pembuatan sistem *fleet calendar* interaktif, integrasi visual metrik finansial, dan pembersihan komponen redundan.

---

## 5. Hasil
- **Apa yang Berhasil Dicapai:**  
  - Terciptanya sistem manajemen rental mobil yang stabil dan *full-stack*, menghubungkan portal pemesanan pelanggan dengan panel kendali admin secara *real-time*.
  - Penghapusan risiko *double booking* berkat validasi ketersediaan kendaraan berbasis rentang tanggal.
  - Efisiensi kerja pengelola rental meningkat drastis melalui visibilitas armada satu layar: admin dapat melihat status kendaraan yang harus diambil atau dikembalikan pada hari H secara instan.
- **Kualitas Kode & Pengujian:**  
  - **Type Safety 100%:** Frontend bersih dari error kompilasi TypeScript (`npx tsc --noEmit` lulus).
  - **Backend Test Suite:** Dilengkapi pengujian unit dan integrasi untuk memastikan endpoint otentikasi dan reservasi berjalan konsisten.
  - **Robustness:** Menerapkan pengaman *state lifecycle* (`isMounted` guards) untuk mencegah memory leak saat admin berganti tab secara cepat.
- **Tautan Repositori:**  
  - GitHub Repository: [asyzyni/velon-WebAPP](https://github.com/asyzyni/velon-WebAPP)

---

## 6. Teknologi yang Digunakan
- **Frontend Layer:**
  - **React 19 & TypeScript:** Menyediakan arsitektur berbasis komponen yang kuat, deklaratif, dan *type-safe*, meminimalisir potensi bug saat menangani struktur data booking yang kompleks.
  - **Vite:** *Build tool* generasi baru dengan waktu startup kilat dan Hot Module Replacement (HMR) yang memacu produktivitas development.
  - **Tailwind CSS & Radix UI:** Kombinasi styling utilitas dan komponen *headless accessible* untuk menciptakan antarmuka modern yang konsisten dan responsif.
  - **Lucide React:** Koleksi ikon visual yang ringan dan seragam.

- **Backend Layer:**
  - **Java & Spring Boot 2.7:** Kerangka kerja tangguh untuk logika bisnis berskala *enterprise*, manajemen ketergantungan (*dependency injection*), dan keamanan data transaksi.
  - **Spring Data JPA & Hibernate:** Menghubungkan entitas objek dengan basis data secara elegan serta memproteksi sistem dari serangan SQL Injection melalui parameterized queries.
  - **PostgreSQL:** Basis data relasional dengan integritas relasi referensial yang andal untuk menjamin konsistensi data antara pengguna, mobil, booking, dan transaksi.

- **Tools Pendukung:**
  - **Maven:** Manajemen dependensi dan otomasi proses build backend.
  - **Git & GitHub:** Sistem kontrol versi untuk pelacakan cabang dan integrasi fitur.

---

## 7. Refleksi & Pembelajaran
- **Pelajaran Berharga:**
  - **Desain yang Baik adalah yang Mengurangi Beban Pikiran Pengguna:** Keputusan menghapus tabel booking terpisah dan menggabungkannya ke dalam kalender interaktif membuktikan bahwa integrasi visual yang tepat jauh lebih bernilai bagi admin daripada menambah banyak menu yang membingungkan.
  - **Ketelitian pada Detail Teknis Laten:** Menghadapi *bug* penanggalan zona waktu memperdalam pemahaman saya mengenai representasi data waktu antara client, server, dan basis data relasional.
- **Apa yang Akan Dilakukan Berbeda:**
  - Menerapkan pendekatan **Mobile-First Design** secara menyeluruh sejak sketsa pertama, sehingga kenyamanan pengguna di perangkat layar kecil setara dengan pengalaman desktop.
  - Mengintegrasikan *Automated End-to-End (E2E) Testing* (misal menggunakan Playwright atau Cypress) untuk memvalidasi alur checkout dan upload bukti transfer secara otomatis pada setiap pull request.
  - Menerapkan *Payment Gateway webhook* langsung (seperti Midtrans/Stripe) alih-alih upload bukti transfer manual untuk otomasi penuh status transaksi.
- **Refleksi Cara Berpikir & Problem Solving:**  
  Proyek ini merefleksikan semangat saya untuk tidak cepat puas pada tahap "aplikasi sekadar berjalan". Saya selalu terdorong untuk mengevaluasi kembali kegunaan produk dari sudut pandang pengguna nyata, berani memangkas fitur yang tidak efektif, dan melakukan refaktorisasi arsitektur demi mencapai solusi yang elegan, bersih, dan berdampak nyata.

---

## 8. Setup & Instalasi

### Prasyarat
- Java 8 atau 17+ & Maven
- Node.js 18+ & npm
- PostgreSQL (database aktif di port `5432`)

### 1. Kloning Repositori
```bash
git clone https://github.com/asyzyni/velon-WebAPP.git
cd velon-WebAPP
```

### 2. Konfigurasi Basis Data
Buat database baru di PostgreSQL:
```sql
CREATE DATABASE velon_db;
```

### 3. Menjalankan Backend (Spring Boot)
1. Buka file konfigurasi di `Back-End/backend/src/main/resources/application.properties`.
2. Sesuaikan kredensial username dan password PostgreSQL Anda.
3. Jalankan aplikasi:
```bash
cd Back-End/backend
mvn clean install
mvn spring-boot:run
```
*Backend akan aktif di `http://localhost:8081`.*

### 4. Menjalankan Frontend (React + Vite)
Di terminal baru:
```bash
cd Front-End/App
npm install
npm run dev
```
*Frontend akan aktif di `http://localhost:5173`.*

### 5. Akun Pengujian (Testing Accounts)
Gunakan kredensial berikut untuk menguji aplikasi:
- **Akun Administrator:**  
  - Email: `admin@velon.com` | Password: `admin123`
- **Akun Pelanggan (User):**  
  - Email: `user@velon.com` | Password: `user123` *(atau daftar akun baru via halaman register)*

---

## 9. Kredit & Tim

### Tim Pengembang
- **Asyifa Izayani** — *Project Lead, Full-Stack Architecture, Backend Core & Interactive UI Development*
- **Muhammad Pandu** — *Frontend Collaborator & Component Integration*
- **Delyana Ika** — *UI/UX Wireframing & Requirements Documentation*
- **Febycandra** — *Quality Assurance & Data Verification*

### Sumber Daya & Pustaka Pihak Ketiga
- [Spring Boot](https://spring.io/projects/spring-boot) & [Spring Data JPA](https://spring.io/projects/spring-data-jpa) — Framework backend dan ORM
- [React](https://react.dev/) & [Vite](https://vitejs.dev/) — Library antarmuka dan development build tool
- [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) — Desain styling utilitas dan komponen antarmuka
- [Lucide Icons](https://lucide.dev/) — Ikonografi sistem
- [Unsplash](https://unsplash.com/) — Aset foto kendaraan untuk keperluan demo dan edukasi
