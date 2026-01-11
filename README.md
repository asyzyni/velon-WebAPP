# 🚗 Velon Car Rental Website

Aplikasi web rental mobil yang lengkap dengan sistem manajemen booking, payment, dan administrasi. Dibangun menggunakan **Spring Boot** untuk backend dan **React + TypeScript** untuk frontend.

---

## 📋 Deskripsi Project

**Velon Car Rental** adalah platform rental mobil online yang memungkinkan:
- 👤 **User** dapat mencari mobil, melakukan booking, upload bukti pembayaran, dan mengelola riwayat booking
- 👨‍💼 **Admin** dapat mengelola data mobil, verifikasi pembayaran, dan monitoring semua booking

---

## 🏗️ Arsitektur

### **Backend Architecture**
Backend mengimplementasikan **Object-Oriented Programming (OOP)** dengan struktur:

```
Back-End/backend/src/main/java/com/velon/
├── config/              # Konfigurasi aplikasi
├── controller/          # REST API Controllers
│   ├── auth/           # Authentication & Session
│   ├── booking/        # Booking operations
│   ├── payment/        # Payment handling
│   ├── admin/          # Admin management
│   └── Car/            # Car search
├── dao/                # Data Access Objects
├── model/              
│   ├── entity/         # JPA Entities
│   └── dto/            # Data Transfer Objects
├── service/            # Business Logic
└── util/               # Utility classes
```

### **Frontend Architecture**
```
Front-End/App/src/
├── api/                # API integration services
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature components
├── assets/             # Images & static files
├── App.tsx            # Main application
└── main.tsx           # Entry point
```

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![Java](https://img.shields.io/badge/Java-8-red?logo=java) | 1.8 | Programming Language |
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-brightgreen?logo=spring) | 2.7.18 | Backend Framework |
| ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-2.7.18-green?logo=spring) | 2.7.18 | ORM Framework |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql) | Latest | Database |
| ![Lombok](https://img.shields.io/badge/Lombok-1.18.30-red) | 1.18.30 | Reduce Boilerplate Code |
| ![Maven](https://img.shields.io/badge/Maven-4.0.0-orange?logo=apache-maven) | 4.0.0 | Build Tool |

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react) | 19.2.0 | UI Library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript) | 5.9.3 | Type Safety |
| ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple?logo=vite) | 7.2.4 | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-cyan?logo=tailwindcss) | 3.4.17 | CSS Framework |
| ![Axios](https://img.shields.io/badge/Axios-1.13.2-purple) | 1.13.2 | HTTP Client |
| ![React Router](https://img.shields.io/badge/React%20Router-7.11.0-red?logo=react-router) | 7.11.0 | Routing |
| ![Radix UI](https://img.shields.io/badge/Radix%20UI-Latest-black) | Latest | Headless Components |

---

## 📦 Fitur Utama

### 🔐 Authentication & Authorization
- Register & Login system
- Session management
- Role-based access (USER / ADMIN)

### 🚙 Car Management
- Pencarian mobil berdasarkan kriteria
- Filter berdasarkan jenis, kapasitas, dan harga
- Cek ketersediaan mobil real-time

### 📅 Booking System
- **Create Booking**: Buat booking baru dengan validasi ketersediaan
- **Reschedule Booking**: Ubah tanggal booking
- **Cancel Booking**: Batalkan booking
- **Booking History**: Lihat riwayat booking

### 💳 Payment System
- Upload bukti pembayaran
- Admin verification system
- Transaction tracking

### 👨‍💼 Admin Panel
- Manajemen data mobil (CRUD)
- Verifikasi pembayaran
- Monitoring semua booking
- Update status booking

---

## 🔑 Konsep OOP yang Diimplementasikan

### 1️⃣ **Encapsulation**
```java
// Entity Car mengenkapsulasi data mobil
@Entity
@Table(name = "car")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name="nama_mobil")
    private String namaMobil;
    
    // Getters and Setters
}
```

### 2️⃣ **Inheritance**
```java
// DAO menggunakan inheritance dari JpaRepository
@Repository
public interface BookingDAO extends JpaRepository<Booking, Integer> {
    // Custom queries
}
```

### 3️⃣ **Abstraction**
```java
// Interface untuk operasi booking
public interface BookingOperation {
    void processBooking();
}
```

### 4️⃣ **Polymorphism**
- Method overriding di controllers
- Interface implementation di service layer

---

## 🗃️ Database Schema

### **Main Tables:**
- `users` - Data pengguna (USER / ADMIN)
- `car` - Data mobil
- `booking` - Data booking
- `transaction` - Data transaksi pembayaran

### **Key Relationships:**
```
users (1) ─────< (N) booking
car (1) ────────< (N) booking
booking (1) ────< (N) transaction
```

---

## 🚀 Cara Menjalankan

### **Prerequisites**
- Java 8 or higher
- Maven
- PostgreSQL
- Node.js & npm
- Git

### **Backend Setup**

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd VelonCarRentWebsite/Back-End/backend
   ```

2. **Setup Database**
   ```sql
   CREATE DATABASE velon_db;
   ```

3. **Konfigurasi Database**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/velon_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Jalankan Backend**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   
   Backend akan berjalan di: `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd VelonCarRentWebsite/Front-End/App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend akan berjalan di: `http://localhost:5173`

---

## 📡 API Endpoints

### **Authentication**
```
POST   /api/auth/register      - Register user baru
POST   /api/auth/login         - Login
GET    /api/auth/session       - Get session info
POST   /api/auth/logout        - Logout
```

### **Car**
```
GET    /api/cars               - Get all cars
GET    /api/cars/search        - Search cars
GET    /api/cars/{id}          - Get car by ID
POST   /api/admin/cars         - Create car (Admin)
PUT    /api/admin/cars/{id}    - Update car (Admin)
DELETE /api/admin/cars/{id}    - Delete car (Admin)
```

### **Booking**
```
POST   /api/booking/init       - Create booking
GET    /api/booking/history    - Get user booking history
PUT    /api/booking/reschedule - Reschedule booking
POST   /api/booking/cancel     - Cancel booking
GET    /api/admin/bookings     - Get all bookings (Admin)
```

### **Payment**
```
POST   /api/payment/upload     - Upload payment proof
PUT    /api/payment/verify     - Verify payment (Admin)
GET    /api/payment/history    - Get payment history
```

---

## 📂 Directory Upload

Backend menyimpan file upload di:
```
Back-End/backend/uploads/
```

---

## 🎨 UI Components

Frontend menggunakan komponen dari:
- **Radix UI** - Headless components
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Pre-built components

---

## 🔒 Security Features

- Password hashing
- Session-based authentication
- Role-based authorization
- Input validation
- SQL injection prevention (JPA)

---

## 📝 Development Notes

### **Backend**
- Menggunakan **Spring Data JPA** untuk database operations
- **Custom queries** dengan `@Query` annotation
- **Transaction management** untuk data consistency
- **File upload** handling untuk payment proof

### **Frontend**
- **Type-safe** dengan TypeScript
- **Component-based** architecture
- **Responsive design** dengan Tailwind CSS
- **Client-side routing** dengan React Router
- **State management** dengan React hooks

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
```bash
# Cek PostgreSQL service
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql
```

### Frontend tidak bisa connect ke backend
- Pastikan backend berjalan di `http://localhost:8080`
- Check CORS configuration di backend
- Verifikasi API endpoint di frontend

---

## 📚 Dokumentasi Tambahan

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

## 👥 Contributors

- **Asyifa Izayani**
- **Muhammad Pandu**
- **Delyana Ika**
- **Febycandra**

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Spring Framework Team
- React Team
- PostgreSQL Community
- Radix UI & Shadcn/ui

---

**Happy Coding! 🚀**
