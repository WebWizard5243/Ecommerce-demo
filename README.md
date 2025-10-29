

# E-Commerce Product Catalog 

**Name - Md Kaif Nawaz Khurram**
**Date - 29/10/2025**

This project is a full-stack web application built using **Next.js 16**, **TypeScript**, **PostgreSQL (Neon)**, and **Cloudinary**.  
It demonstrates multiple **Next.js rendering strategies** — **SSG**, **ISR**, **SSR**, and **CSR** — to balance performance, scalability, and real-time data updates.

---
## Features 

* Product catalog with search and category filters

* Product detail pages with ISR regeneration

* Admin panel for product management

* Cloudinary integration for image uploads

* PostgreSQL database with live connection

* Responsive UI using Tailwind CSS

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/WebWizard5243/Ecommerce-demo.git
cd Ecommerce-demo
```

### 2. Install Dependencies
```undefined
npm install
```

### 3. Setup Environment Variables
```undefined
DATABASE_URL="postgresql://user:password@host:port/database"
ADMIN_API_KEY="your_admin_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

### 4. Database Setup

Run the following SQL commands in your PostgreSQL (Neon) database:
```undefined
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  price DECIMAL(10,2),
  category VARCHAR(100),
  inventory INTEGER,
  image_urls TEXT[]
);
```
  ### 5. Start the Development Server
```undefined
  npm run dev
```
  ## Folder Structure 
  ```
  app/
├── page.tsx               # Home page (SSG)
├── products/[slug]/       # Product details (ISR)
├── dashboard/page.tsx     # Inventory dashboard (SSR)
├── admin/page.tsx         # Admin panel (CSR)
├── api/products/          # Product APIs
├── api/upload/            # Image upload API
lib/
└── db.ts                  # Database connection & helper functions
```

