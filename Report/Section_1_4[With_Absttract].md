# ABSTRACT

This project is a full-stack, role-based ride-hailing web application designed to digitally manage the complete urban commute workflow between passengers, drivers, and administrators. The system is built with React (Vite + TypeScript) on the frontend and Node.js with Express on the backend, with MongoDB as the primary database using Mongoose for schema modeling. Real-time operations such as ride request broadcast, ride status updates, and role-specific live notifications are handled through Socket.IO, while secure access control is implemented using JWT-based authentication and role guards. The project addresses practical transportation issues like delayed driver allocation, manual fare estimation, weak transparency in ride tracking, and inefficient driver verification workflows. Key features include user signup/login with role separation, ride booking and lifecycle management, nearest-driver matching, dynamic fare estimation with surge logic, driver document verification, earnings management, and admin analytics dashboards for users, rides, revenue, and demand trends. The implementation outcome is a functional and test-backed platform that improves reliability, response speed, operational visibility, and scalability for a real-world smart mobility use case.

# 1. INTRODUCTION

## 1.1 Background of the Project
Urban mobility is now strongly connected with digital services, but many local transport operations still depend on phone calls, manual coordination, or fragmented applications. In such systems, passengers often face uncertainty in waiting time, drivers receive requests without clear prioritization, and administrators have limited visibility into system performance. This project was developed to bridge that operational gap by delivering a centralized, role-based ride-hailing platform. It integrates passenger booking, driver response, and admin supervision in one full-stack workflow.

## 1.2 Need for the Application
The project is needed to solve common mobility challenges:
- Delay in matching passengers with nearby available drivers.
- Fare ambiguity due to non-standard or manually calculated pricing.
- Limited real-time tracking of trip progress and ride states.
- Weak, inconsistent driver onboarding and document review workflows.
- Disconnected analytics for demand, earnings, and complaints.

## 1.3 Objective of the Application
The main objective is to implement a secure and scalable application that automates the complete ride lifecycle while maintaining transparency and control for all stakeholders. The platform is designed to support smooth booking for passengers, efficient request handling for drivers, and data-driven governance for administrators.

## 1.4 Overview of Modules
- Authentication and Authorization: role-based signup/login, JWT sessions, protected routes.
- Passenger Module: ride booking, map-assisted pickup and drop selection, live ride status, trip history.
- Driver Module: ride request acceptance or rejection, ongoing trip screens, profile and earnings views.
- Ride and Matching Module: state transitions from request to completion, nearest-driver selection, cancellation flow.
- Pricing Module: estimate and final fare computation using distance, duration, waiting time, and surge values.
- Verification and Admin Module: document upload and review pipeline, dashboard analytics, complaints and user management.
- Socket Communication Layer: real-time ride and verification events across passenger, driver, and admin interfaces.

Overall, this introduction establishes the project as a practical full-stack mobility solution focused on speed, transparency, and operational accountability.

# 2. PROBLEM STATEMENT

The project addresses a real-world transport management problem: local ride-booking operations are often slow, non-transparent, and difficult to monitor end-to-end. In many existing setups, passengers cannot predict waiting time or fare confidence, drivers do not always receive optimized ride opportunities, and operators struggle to enforce quality and safety policies. These limitations directly affect user trust, service reliability, and platform growth.

## 2.1 Existing Issues
- Manual or weakly integrated booking channels cause delayed ride assignment.
- Pricing inconsistency creates disputes and lowers passenger confidence.
- Absence of continuous ride-state tracking makes trip monitoring difficult.
- Driver verification is often delayed, undocumented, or inconsistently reviewed.
- Admin teams cannot easily view real-time demand patterns, earnings, and service issues in one place.

## 2.2 Need for Automation / Digitization
To overcome these issues, a centralized digital platform is required to automate the ride lifecycle from request generation to trip completion. Automation is also needed for secure role handling, document verification, fare computation, and event logging. Digitization ensures that operational decisions are not based on assumptions but on measurable ride data and live system signals.

## 2.3 Expected Solution
The expected solution is a full-stack ride-hailing system with REST APIs, real-time socket events, and role-specific dashboards. It should provide fast driver matching, transparent estimate and final fare logic, and clear status progression across passenger and driver screens. It should also include structured verification workflows and admin analytics for demand and revenue visibility. By delivering these capabilities, the project aims to improve booking speed, reduce disputes, strengthen compliance, and create a scalable foundation for smart urban mobility services.

# 3. SYSTEM REQUIREMENTS

## 3.1 Software Requirements
The software stack is selected to support a modern, modular, and maintainable full-stack architecture for real-time ride management.

- Operating System: Windows 10/11 or Linux.
- Development Environment: Visual Studio Code.
- Frontend Technologies: React, TypeScript, Vite, React Router, CSS utility-driven styling.
- Mapping and Geospatial UI: Leaflet and React-Leaflet.
- Backend Runtime and Framework: Node.js with Express.
- Database Layer: MongoDB with Mongoose ODM.
- Real-Time Communication: Socket.IO for event-based ride updates.
- API Protocol and Data Format: REST endpoints with JSON payloads.
- Security and Middleware: JWT authentication, CORS, Helmet, Express rate limit, Multer for uploads.
- Testing Utilities: Jest, Supertest, MongoDB Memory Server.
- Version Control and Collaboration: Git and GitHub.
- Target Browser: Latest Chrome or Edge.

These tools collectively support rapid development, smooth API integration, and production-friendly deployment practices.

## 3.2 Hardware Requirements
Minimum:
- RAM: 4 GB.
- Storage: 40 GB free disk space.
- Processor: Dual-core CPU.

Recommended:
- RAM: 8 GB or higher.
- Storage: SSD with at least 10 GB free project space.
- Processor: Intel i5 / Ryzen 5 class CPU or better.
- Network: Stable broadband for map services and real-time socket traffic.

The minimum hardware is enough for local development and functional testing, while the recommended configuration ensures smoother frontend builds, backend test execution, and concurrent database plus socket workloads.

# 4. TECHNOLOGIES USED

## 4.1 Frontend
The frontend is built using React with TypeScript to create reusable, strongly typed, and role-specific interfaces for passengers, drivers, and administrators. Vite is used as the build tool for faster startup, hot reload performance, and optimized production builds. React Router manages navigation between login, dashboard, booking, verification, and analytics flows. Map-driven interaction is supported through Leaflet and React-Leaflet for location-centric user experiences.

## 4.2 Backend
The backend uses Node.js and Express to deliver modular REST APIs and business services for authentication, ride management, pricing, verification, earnings, and admin analytics. Middleware layers handle authorization, validation, upload management, and error control. Socket.IO integration on the server enables real-time events such as ride status changes and role-based notifications.

## 4.3 Database
MongoDB is used as the primary data store for users, rides, location logs, demand zones, earnings, and verification records. Mongoose provides schema definitions, model relations, and validation rules to enforce consistent and reliable data operations.

## 4.4 API Communication
The project combines REST and WebSocket-style communication. REST with JSON is used for request-response operations such as signup, booking, analytics, and profile management. Socket.IO enables low-latency, event-driven updates for ride requests, assignment, trip progression, and admin feed updates.

## 4.5 Version Control
Git is used for source tracking, branching, and rollback support, while GitHub is used for remote collaboration, issue-based development, and integration workflows. Together, these technologies provide maintainability, traceability, and team coordination across the project lifecycle.

Overall, this technology stack was selected to balance development speed, real-time responsiveness, security, and long-term scalability for a production-oriented ride-hailing application.
