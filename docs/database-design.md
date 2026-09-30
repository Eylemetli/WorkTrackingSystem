\# Database Design



\## Main Entities

Users

Roles

Departments

Projects

ProjectMembers

Tasks

TaskComments

WorkLogs

Notifications

Files

AuditLogs



\## Main Relationships



Roles 1 --- N Users



Departments 1 --- N Users



Users 1 --- N Projects

(Manager relationship)



Projects N --- N Users

(via ProjectMembers)



Projects 1 --- N Tasks



Users 1 --- N Tasks

(Assigned employee)



Tasks 1 --- N TaskComments



Tasks 1 --- N WorkLogs



Tasks 1 --- N Files



Users 1 --- N Notifications



Users 1 --- N AuditLogs

