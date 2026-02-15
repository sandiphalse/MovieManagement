
Readme · MD
Copy

# Movie Management System

A full-stack movie management application built with **Angular 21** (frontend) and **ASP.NET Core 8** (backend).


## Prerequisites

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Node.js (v18+)** - [Download](https://nodejs.org/)
- **Angular CLI** - Install: `npm install -g @angular/cli`

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/sandiphalse/MovieManagement.git
cd MovieManagement
```

### 2. Backend Setup

**Update Connection String:**

Edit `MovieManagement.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MovieManagementDb;Trusted_Connection=True;TrustServerCertificate=True"
}
```

**Apply Database Migrations:**

```bash
cd MovieManagement.Infrastructure
dotnet ef database update --startup-project ../MovieManagement.API
```

**Run Backend:**

```bash
cd MovieManagement.API
dotnet run
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

**Install Dependencies:**

```bash
cd movie-management-ui
npm install
```

**Run Frontend:**

```bash
ng serve
```

Frontend runs at: `http://localhost:4200`

### 4. Access Application

Open browser: `http://localhost:4200`

---

## 🧪 Running Tests

**Backend Tests:**

```bash
cd MovieManagement.Tests
dotnet test
```

**Frontend Tests:**

```bash
cd movie-management-ui
ng test
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/latest` | Get latest 4 movies |
| GET | `/api/movies/{id}` | Get movie by ID |
| POST | `/api/movies` | Create new movie |
| PUT | `/api/movies/{id}` | Update movie |
| DELETE | `/api/movies/{id}` | Delete movie |
| GET | `/api/movies/search?searchType={type}&searchValue={value}` | Search movies |

---

## 🐛 Troubleshooting

**Database connection fails:**
- Verify SQL Server is running
- Check connection string in `appsettings.json`

**Port already in use:**
- Backend: Change port in `Program.cs`
- Frontend: Run `ng serve --port 4201`

**CORS errors:**
- Ensure backend is running on `http://localhost:5000`
- Check CORS policy in `Program.cs`