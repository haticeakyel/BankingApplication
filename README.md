# Mini Banking Application (Full-Stack)

This is a full-stack banking application built with **Java Spring Boot** for the backend and **React** for the frontend.

Users can register, create bank accounts, transfer money, and view transaction history.

---

## Project Structure
.
- ├── bank-app # Spring Boot backend
- └── bank-app-front # React frontend

## Technologies

- **Java 17**
- **Spring Boot**
- **React latest version**
- **JWT** (Authentication)
- **MYSQL** 


## Features

### Backend (Spring Boot)
- User registration and login
- JWT-based authentication
- Create, update, delete, and search accounts
- Money transfers between accounts
- View transaction history

### Frontend (React)
- Login and register pages
- Account listing and search
- Account details and balance view
- Money transfer form with validation
- Transaction history page
- Routing with React Router

---

## How to Run

### Backend

cd bank-app
./mvnw spring-boot:run 

### Frontend
cd bank-app-front
npm install
npm start

##APIs
- POST   /api/users/register         → Register with email, username, password
- POST   /api/users/login            → Login and get JWT
- POST   /api/accounts               → Create new account
- GET    /api/accounts               → List all user accounts
- POST   /api/accounts/search        → Search accounts by number or name
- GET    /api/accounts/{id}          → Get specific account details
- PUT    /api/accounts/{id}          → Update account
- DELETE /api/accounts/{id}          → Delete account
- POST   /api/transactions/transfer  → Transfer money between accounts
- GET    /api/transactions/account/{id} → View transaction history of an account

