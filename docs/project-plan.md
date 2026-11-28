# ShopEasy - Project Plan

## 1. Project Overview

| Item | Description |
|---|---|
| Project name | ShopEasy - Online Shopping Website |
| Course | Web Design and Development (CSB25022) |
| Project start date | 10 November 2026 |
| Project deadline | 25 November 2026 |
| Repository | https://github.com/manhtoandng-boop/ShopEasy |
| Developer | 1 student (individual project execution) |

ShopEasy is an online shopping website that allows customers to browse products, search and filter products, manage a shopping cart, and place orders.

The project is developed individually. One student is responsible for planning, UI design, frontend development, backend development, database integration, testing, and deployment. No additional team members or group meetings are claimed.

## 2. Project Objectives

- Build a responsive online shopping website.
- Display products and their information dynamically from a database.
- Allow customers to search and filter products.
- Provide shopping cart and checkout functionality.
- Validate order information and product stock.
- Store order and payment information in the database.
- Deploy the frontend and document the development process.

## 3. Project Scope

### 3.1 In Scope

- Homepage and product listing.
- Product categories and search.
- Product details and navigation.
- Shopping cart: add, update quantity, and remove products.
- Checkout form and order confirmation.
- Backend API using Node.js and Express.
- MySQL database integration.
- Product, order, order-item, and payment data.
- Product discounts and voucher validation (subject to implementation verification).
- Responsive layout and basic interaction testing.
- Deployment and project documentation.

### 3.2 Out of Scope

- A production-grade payment gateway integration.
- A full administrator dashboard.
- Multi-vendor marketplace functionality.
- Advanced recommendation or machine-learning systems.

## 4. Technology Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | CSS, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MySQL |
| Version control | Git and GitHub |
| Deployment | GitHub Pages |
| Design documentation | Markdown and Mermaid |

Note: MySQL is the database used in the current implementation. The original course brief may specify a different database technology; this implementation difference is documented rather than concealed.

## 5. Roles and Responsibilities

The project is completed by one student. Responsibilities are divided by work area, not by separate team members.

| Role | Responsibilities |
|---|---|
| Project planning | Define scope, requirements, milestones, and task priorities |
| UI/UX design | Plan page layouts and responsive interfaces |
| Frontend development | Implement React pages, navigation, product display, cart, and checkout |
| Backend development | Implement Express APIs and business logic |
| Database development | Design tables, relationships, and SQL queries |
| Testing and deployment | Test interactions, check responsive layouts, build, and deploy the website |
| Documentation | Maintain README, project plan, ERD, and development evidence |

## 6. Project Timeline and Sprints

The project follows five GitHub milestones. The final implementation, integration, and testing activities may overlap during the final project period.

| Sprint | Period | Main activities | GitHub milestone |
|---|---|---|---|
| Sprint 1 | 10-13 Nov 2026 | Project scope, requirements, UI planning, repository setup | #1 |
| Sprint 2 | 14-17 Nov 2026 | Homepage, product listing, product navigation, search and filtering | #2 |
| Sprint 3 | 18-21 Nov 2026 | Backend APIs, MySQL integration, database documentation | #3 |
| Sprint 4 | 22-25 Nov 2026 | Shopping cart, checkout, order processing, voucher work | #4 |
| Sprint 5 | 22-25 Nov 2026 | Final integration, responsive testing, performance checks, deployment and documentation | #5 |

The milestone due dates are retained as configured in GitHub:
- Sprint 1: 13 November 2026
- Sprint 2: 17 November 2026
- Sprint 3: 21 November 2026
- Sprint 4: 25 November 2026
- Sprint 5: 25 November 2026

## 7. Task Tracking

Tasks are tracked through GitHub Issues and Milestones.

Repository Issues:
- #1 Define project scope and requirements
- #2 Design website wireframes and user interface
- #3 Set up project repository and development environment
- #4 Implement responsive homepage and product listing
- #5 Implement product details and website navigation
- #6 Implement product search and category filtering
- #7 Develop backend APIs for product management
- #8 Implement order and payment management APIs
- #9 Document database schema and entity relationships
- #10 Implement shopping cart functionality
- #11 Implement checkout and order confirmation
- #12 Implement voucher validation and discount calculation
- #13 Test responsive layouts and user interactions
- #14 Measure and optimize website performance with Lighthouse
- #15 Set up website analytics and error monitoring
- #16 Verify deployment and complete project documentation

All tasks are managed by the individual developer. Issue status and completion should reflect actual implementation and verification.

## 8. Development and Version Control Workflow

The project uses Git and GitHub to track source-code changes.

Planned workflow:
1. Create or select a GitHub Issue for a task.
2. Work on a focused change.
3. Use a descriptive commit message.
4. Push changes to GitHub.
5. Review the change and verify that existing functionality is preserved.
6. Link relevant commits or pull requests to their Issues when applicable.

The repository history contains work performed directly on the main branch. Feature branches and pull requests should be used for subsequent work where practical. Existing commit history is not rewritten to create evidence retroactively.

## 9. Testing and Quality Assurance

Testing activities include:
- Check that product data loads from the backend.
- Test product search and category filtering.
- Test adding, updating, and removing cart items.
- Test checkout form validation.
- Check order creation and stock validation.
- Test voucher validation when the feature is available.
- Check layouts at desktop, tablet, and mobile widths.
- Run a production build and inspect deployment results.
- Use Lighthouse to identify performance and accessibility improvements.

Test results and screenshots should be added as evidence after the tests are actually performed.

## 10. Project Risks and Limitations

| Risk | Mitigation |
|---|---|
| Limited development time | Prioritize required shopping and checkout functions |
| Database integration errors | Test backend APIs and database queries locally |
| Deployment differences | Verify the deployed site after each important release |
| Solo development workload | Break work into small issues and milestones |
| Course technology differences | Clearly document the technologies actually used |

## 11. Project Progress Records

GitHub Issues, commits, milestones, and repository documentation are used as the project work record.

Because this project is completed individually, no group meeting minutes or decisions involving nonexistent team members are included. Any future progress updates should be recorded with their actual dates and evidence.

## 12. Related Documentation

- [README](../README.md)
- [Database Schema](../database/schema.sql)
- [Entity Relationship Diagram](./ERD.md)
