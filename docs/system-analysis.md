\# Work Tracking System - System Analysis



\## 1. Project Purpose



Work Tracking System, bir şirket içerisindeki proje, görev ve çalışan süreçlerinin merkezi bir sistem üzerinden yönetilmesini sağlayan web tabanlı bir iş takip uygulamasıdır.



Sistem sayesinde yöneticiler projeleri ve görevleri yönetebilir, çalışanlar kendilerine atanan görevleri takip edebilir ve yöneticiler çalışanların genel performansını izleyebilir.



Sistem üç farklı kullanıcı rolüne sahip olacaktır:



\- Admin

\- Manager

\- Employee



\---



\## 2. User Roles



\### 2.1 Admin



Admin sistemin genel yönetiminden sorumludur.



Admin yetkileri:



\- Kullanıcı oluşturma

\- Kullanıcı bilgilerini güncelleme

\- Kullanıcı silme

\- Kullanıcı aktif/pasif durumu değiştirme

\- Kullanıcılara rol atama

\- Departman oluşturma

\- Departman düzenleme

\- Departman silme

\- Proje oluşturma

\- Proje yöneticisi atama

\- Proje aktif/pasif durumunu değiştirme

\- Sistem genelindeki istatistikleri görüntüleme

\- Sistem loglarını görüntüleme



\---



\### 2.2 Manager



Manager kendisine bağlı projelerin ve çalışanların yönetiminden sorumludur.



Manager yetkileri:



\- Proje oluşturma

\- Proje bilgilerini güncelleme

\- Projeye çalışan ekleme

\- Proje başlangıç ve bitiş tarihlerini belirleme

\- Proje durumunu değiştirme

\- Görev oluşturma

\- Görevi çalışana atama

\- Görev önceliği belirleme

\- Görev son teslim tarihi belirleme

\- Çalışanların görev durumlarını takip etme

\- Görevlere yorum ekleme

\- Çalışma kayıtlarını görüntüleme



\---



\### 2.3 Employee



Employee kendisine atanmış görevlerden sorumludur.



Employee yetkileri:



\- Kendisine atanmış görevleri görüntüleme

\- Görev detaylarını görüntüleme

\- Görev durumunu güncelleme

\- Görevlere yorum ekleme

\- Göreve dosya yükleme

\- Çalışma kaydı oluşturma

\- Kendisine ait bildirimleri görüntüleme



\---



\## 3. Main Modules



Sistem aşağıdaki temel modüllerden oluşacaktır:



\### Authentication Module



Kullanıcıların sisteme güvenli şekilde giriş yapmasını sağlayacaktır.



Temel işlemler:



\- Login

\- JWT Token oluşturma

\- Kullanıcı doğrulama

\- Rol bazlı yetkilendirme



\### User Management Module



Kullanıcıların sistem üzerinde yönetilmesini sağlayacaktır.



\### Department Management Module



Şirket içerisindeki departmanların yönetilmesini sağlayacaktır.



Örnek departmanlar:



\- Software

\- Human Resources

\- Accounting

\- Marketing



\### Project Management Module



Projelerin oluşturulmasını ve çalışanların projelere dahil edilmesini sağlayacaktır.



\### Task Management Module



Projeler içerisindeki görevlerin oluşturulmasını ve çalışanlara atanmasını sağlayacaktır.



Görev durumları:



\- Pending

\- In Progress

\- In Review

\- Completed



Görev öncelikleri:



\- Low

\- Medium

\- High

\- Critical



\### Task Comment Module



Manager ve Employee kullanıcılarının görev üzerinden iletişim kurmasını sağlayacaktır.



\### Work Log Module



Çalışanların görev üzerinde gerçekleştirdikleri çalışmaları kayıt altına alacaktır.



Örnek:



\- Çalışma tarihi

\- Çalışma süresi

\- Yapılan işlemler



\### Notification Module



Kullanıcıların sistem içerisindeki önemli olaylardan haberdar edilmesini sağlayacaktır.



Örnek bildirimler:



\- Yeni görev atandı

\- Görev son teslim tarihi yaklaşıyor

\- Görev durumu değiştirildi

\- Göreve yeni yorum eklendi



\### File Management Module



Görevler ile ilgili dosyaların sisteme yüklenmesini sağlayacaktır.



\### Audit Log Module



Sistem üzerinde gerçekleştirilen önemli işlemlerin kayıt altına alınmasını sağlayacaktır.



Örnek:



\- Kullanıcı oluşturuldu

\- Proje oluşturuldu

\- Görev atandı

\- Görev durumu değiştirildi



\---



\## 4. System Architecture



Proje katmanlı bir mimari kullanılarak geliştirilecektir.



Temel sistem akışı:



Frontend

↓

Next.js

↓

ASP.NET Core Web API

↓

Controller

↓

Service

↓

Repository / Entity Framework Core

↓

SQL Server



Backend tarafında Clean Architecture yaklaşımına yakın bir yapı kullanılacaktır.



Backend projeleri:



\- WorkTracking.API

\- WorkTracking.Application

\- WorkTracking.Domain

\- WorkTracking.Infrastructure



\---



\## 5. Database Tables



Sistemde aşağıdaki temel tabloların oluşturulması planlanmaktadır.



\### Users



Kullanıcı bilgilerini tutacaktır.



Temel alanlar:



\- Id

\- FirstName

\- LastName

\- Email

\- PasswordHash

\- RoleId

\- DepartmentId

\- IsActive

\- CreatedAt

\- UpdatedAt



\### Roles



Sistem rollerini tutacaktır.



Roller:



\- Admin

\- Manager

\- Employee



\### Departments



Departman bilgilerini tutacaktır.



Temel alanlar:



\- Id

\- Name

\- Description

\- IsActive



\### Projects



Proje bilgilerini tutacaktır.



Temel alanlar:



\- Id

\- Name

\- Description

\- ManagerId

\- StartDate

\- EndDate

\- Status

\- IsActive

\- CreatedAt



\### ProjectMembers



Projelerde çalışan kullanıcıları tutacaktır.



Temel alanlar:



\- Id

\- ProjectId

\- UserId

\- JoinedAt



\### Tasks



Projelerde bulunan görevleri tutacaktır.



Temel alanlar:



\- Id

\- Title

\- Description

\- ProjectId

\- AssignedUserId

\- CreatedByUserId

\- Priority

\- Status

\- DueDate

\- CreatedAt

\- UpdatedAt



\### TaskComments



Görev yorumlarını tutacaktır.



Temel alanlar:



\- Id

\- TaskId

\- UserId

\- Comment

\- CreatedAt



\### WorkLogs



Çalışanların görev çalışma kayıtlarını tutacaktır.



Temel alanlar:



\- Id

\- TaskId

\- UserId

\- WorkDate

\- Duration

\- Description

\- CreatedAt



\### Notifications



Kullanıcı bildirimlerini tutacaktır.



Temel alanlar:



\- Id

\- UserId

\- Title

\- Message

\- IsRead

\- CreatedAt



\### Files



Görevlere yüklenen dosya bilgilerini tutacaktır.



Temel alanlar:



\- Id

\- TaskId

\- UserId

\- FileName

\- FilePath

\- UploadedAt



\### AuditLogs



Sistem üzerinde gerçekleştirilen işlemleri tutacaktır.



Temel alanlar:



\- Id

\- UserId

\- Action

\- EntityName

\- EntityId

\- Description

\- CreatedAt



\---



\## 6. Database Relationships



Planlanan temel ilişkiler:



\- Bir Role birden fazla User içerebilir.

\- Bir Department birden fazla User içerebilir.

\- Bir Manager birden fazla Project yönetebilir.

\- Bir Project birden fazla ProjectMember içerebilir.

\- Bir User birden fazla Project içerisinde bulunabilir.

\- Bir Project birden fazla Task içerebilir.

\- Bir Employee birden fazla Task alabilir.

\- Bir Task birden fazla TaskComment içerebilir.

\- Bir Task birden fazla WorkLog içerebilir.

\- Bir Task birden fazla File içerebilir.

\- Bir User birden fazla Notification alabilir.

\- Bir User birden fazla AuditLog oluşturabilir.



\---



\## 7. Planned Technologies



\### Backend



\- .NET 8

\- ASP.NET Core Web API

\- Entity Framework Core

\- SQL Server

\- JWT Authentication

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

