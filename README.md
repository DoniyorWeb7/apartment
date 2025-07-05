# 🏠 Apartment Dashboard — Real Estate Management Panel

A web-based internal dashboard for managing apartment listings. Designed for real estate agents and admins who need a fast and reliable way to store and manage rental/sale apartment data.

---

## 🚀 Technologies Used

- **Next.js** — React framework with SSR and App Router
- **TypeScript** — Strong typing for better development experience
- **Prisma ORM** — Database access and modeling
- **PostgreSQL** — Reliable relational database
- **React Hook Form + Zod** — Efficient form handling with validation
- **Tailwind CSS + shadcn/ui** — Modern, responsive UI
- **NextAuth.js** — Authentication system with JWT and role-based access
- **@tanstack/react-table** — Advanced table with filtering and sorting
- **Telegram Bot API** — Send new listings directly to Telegram channel

---

## 🎯 Purpose of the Website

This project is a lightweight **CRM system** tailored for real estate use. It simplifies and centralizes apartment data management.

### ✅ Key Features:

- 📋 Apartment management:

  - Status (Available/Occupied)
  - Price
  - District
  - Rooms
  - Floor
  - Renovation status
  - Image
  - Availability date

- 👥 Role system:

  - **Admin**:
    - Full access
    - Can create, edit, and delete users
    - Can view and manage all apartments and owners
  - **User**:
    - Can only add and manage **their own** apartments
    - Can create apartment owners
    - Can update or delete their own listings
    - Can send apartments to the Telegram channel

- 🔐 Secure authentication:

  - Handled by `NextAuth`
  - Unique login and password for each user
  - Only one admin has permission to manage all users

- 📤 Telegram integration:
  - One-click button to send apartment data directly to Telegram

---

## 🧠 Problem It Solves

Managing hundreds of listings manually or in spreadsheets is chaotic. This system solves that by:

- 🧩 Structuring apartment information for quick access
- 👨‍💼 Giving admins full control over who can access and manage data
- 🏡 Helping agents quickly find suitable options for clients
- 📤 Automatically distributing listings to Telegram for marketing

---
