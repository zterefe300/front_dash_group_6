# FrontDash Application

Repo for FrontDash application - A comprehensive dashboard for customers, restaurants, and employees.

## Project Structure

```
frontdash-app/
├── public/
├── src/
│   ├── api/
│   │   ├── customer/
│   │   ├── restaurant/
│   │   ├── employee/            # Employee (staff + admin) APIs
│   │   └── index.js
│   │
│   ├── assets/
│   │
│   ├── components/              # Shared UI components
│   │   ├── ui/
│   │   ├── layout/
│   │   └── common/
│   │
│   ├── features/                # Domain-specific modules
│   │   ├── customer/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── restaurant/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   ├── employee/            # Employee portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── hooks/
│   │   │
│   │   └── shared/
│   │
│   ├── hooks/
│   │
│   ├── routes/
│   │   ├── CustomerRoutes.jsx
│   │   ├── RestaurantRoutes.jsx
│   │   ├── EmployeeRoutes.jsx   # Employee role-based routing
│   │   └── index.jsx
│   │
│   ├── store/
│   │   ├── slices/
│   │   └── index.js
│   │
│   ├── styles/
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── index.jsx
│   └── config.js
│
└── package.json
```

## Technologies Used

- **Frontend**: React 19 with Vite
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Overview

This application provides a unified dashboard experience for three main user types:

- **Customers**: Order food
- **Restaurants**: Manage menus, and operations
- **Employees**: Staff and admin functionality for system management
