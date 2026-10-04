\# Work Tracking System



Work Tracking System, şirket içerisindeki proje ve görev süreçlerinin

yönetilmesini sağlayan web tabanlı bir iş takip sistemidir.



\## Project Purpose



Sistem üç farklı kullanıcı rolü üzerinden çalışacaktır:



\- Admin

\- Manager

\- Employee



Admin sistem genelindeki kullanıcıları, departmanları ve projeleri

yönetebilecektir.



Manager projeleri oluşturabilecek, çalışanları projelere dahil

edebilecek ve görev ataması yapabilecektir.



Employee kendisine atanmış görevleri görüntüleyebilecek, görev

durumlarını değiştirebilecek, çalışma kayıtları oluşturabilecek

ve görevler üzerinden yöneticisiyle iletişim kurabilecektir.



\## Technologies



\### Backend



\- .NET 8

\- ASP.NET Core Web API

\- Entity Framework Core

\- SQL Server

\- JWT Authentication

\- Role-Based Authorization

\- FluentValidation

\- Mapster

\- Serilog



\### Frontend



\- Next.js

\- TypeScript

\- Tailwind CSS

\- Axios



\### Testing



\- xUnit

\- Moq



\### Development Tools



\- Git

\- GitHub

\- Docker

\- Swagger

\- Postman



\## Main Modules



\- Authentication

\- User Management

\- Department Management

\- Project Management

\- Task Management

\- Task Comments

\- Work Logs

\- Notifications

\- File Management

\- Audit Logs

\- Dashboard and Reporting

## Backend Architecture

The backend is structured using a layered architecture:

- WorkTracking.API
- WorkTracking.Application
- WorkTracking.Domain
- WorkTracking.Infrastructure

## Implemented Backend Features

### Authentication
- User registration
- User login
- JWT token generation
- Password hashing
- Role-based authorization

### Admin
- User management
- Department management
- Project management
- Audit log monitoring

### Manager / Project Management
- Project creation and update
- Project manager assignment
- Project member management
- Task creation and assignment

### Employee
- View assigned tasks
- Update task status
- Add work logs
- Add task comments
- Upload task files
- View notifications

### Task Management
- Task creation
- Task assignment
- Task priority
- Task status
- Due date management
- Task comments
- Work logs
- File attachments

### Notifications
- In-app notifications
- Automatic task assignment notification
- Read/unread status

### Audit Logs
- User creation logs
- Project creation logs
- Task creation logs

### Validation and Error Handling
- FluentValidation
- Global exception middleware
- Standardized error responses

## Database

SQL Server is used as the database.

Main tables:

- Users
- Roles
- Departments
- Projects
- ProjectMembers
- Tasks
- TaskComments
- WorkLogs
- Notifications
- Files
- AuditLogs

## API Documentation

Swagger is available while the API is running:

```text
http://localhost:5074/swagger

Running the Backend
Navigate to:
backend

Run:
dotnet restore
dotnet build WorkTracking.sln
dotnet run --project WorkTracking.API

Development Status
The first backend development phase has been completed.
Next development phase:
- Next.js frontend
- Admin panel
- Manager panel
- Employee panel
- Dashboard and reporting
- Testing
- Docker deployment
