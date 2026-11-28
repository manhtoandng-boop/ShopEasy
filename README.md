# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# ShopEasy - Online Shopping Website

ShopEasy is an online shopping website developed as a final project for the Web Design and Development course (CSB25022).

## Technologies

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Version control: Git and GitHub

## Database Design

ShopEasy uses a relational MySQL database to manage products, customer orders, order items, and payment records.

### Database schema

- [View database schema](database/schema.sql)

### Entity Relationship Diagram (ERD)

- [View Entity Relationship Diagram](docs/ERD.md)

### Main relationships

| Relationship | Description |
|---|---|
| Orders - Order Items | One order can contain multiple order items. |
| Products - Order Items | A product can appear in multiple order items. |
| Orders - Payments | One order can have multiple payment records. |

### Database notes

- Primary keys uniquely identify records in each table.
- Foreign keys maintain relationships between related records.
- Product discounts are stored in `discount_percent`.
- The database uses MySQL with InnoDB and utf8mb4.

## Project Documentation

The following documents describe the project planning, database structure, and development process.

| Document | Description |
|---|---|
| [Project Plan](docs/project-plan.md) | Project scope, objectives, responsibilities, five-sprint timeline, and development workflow. |
| [Entity Relationship Diagram](docs/ERD.md) | Database entities, primary keys, foreign keys, and relationships. |
| [Database Schema](database/schema.sql) | SQL definitions for the main database tables. |

## Project Repository

- [GitHub Repository](https://github.com/manhtoandng-boop/ShopEasy)
- [GitHub Issues](https://github.com/manhtoandng-boop/ShopEasy/issues)
- [GitHub Pull Requests](https://github.com/manhtoandng-boop/ShopEasy/pulls)
