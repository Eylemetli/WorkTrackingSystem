using Microsoft.EntityFrameworkCore;
using WorkTracking.Domain.Entities;

namespace WorkTracking.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<TaskComment> TaskComments => Set<TaskComment>();
    public DbSet<WorkLog> WorkLogs => Set<WorkLog>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<FileAttachment> Files => Set<FileAttachment>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Project -> Manager(User)
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Manager)
            .WithMany()
            .HasForeignKey(p => p.ManagerId)
            .OnDelete(DeleteBehavior.NoAction);

        // ProjectMember -> User
        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.User)
            .WithMany()
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        // ProjectMember -> Project
        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.Project)
            .WithMany(p => p.ProjectMembers)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        // Task -> Assigned Employee
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.AssignedUser)
            .WithMany()
            .HasForeignKey(t => t.AssignedUserId)
            .OnDelete(DeleteBehavior.NoAction);

        // Task -> Created By User
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.CreatedByUser)
            .WithMany()
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.NoAction);

        // Task -> Project
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskComment>()
.HasOne(tc => tc.Task)
.WithMany()
.HasForeignKey(tc => tc.TaskId)
.OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TaskComment>()
            .HasOne(tc => tc.User)
            .WithMany()
            .HasForeignKey(tc => tc.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<WorkLog>()
            .HasOne(w => w.Task)
            .WithMany()
            .HasForeignKey(w => w.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<WorkLog>()
            .HasOne(w => w.User)
            .WithMany()
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FileAttachment>()
            .HasOne(f => f.Task)
            .WithMany()
            .HasForeignKey(f => f.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FileAttachment>()
            .HasOne(f => f.User)
            .WithMany()
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Role>().HasData(
new Role { Id = 1, Name = "Admin" },
new Role { Id = 2, Name = "Manager" },
new Role { Id = 3, Name = "Employee" }
);

        modelBuilder.Entity<Department>().HasData(
            new Department
            {
                Id = 1,
                Name = "Software",
                Description = "Software Development Department",
                IsActive = true
            },
            new Department
            {
                Id = 2,
                Name = "Human Resources",
                Description = "Human Resources Department",
                IsActive = true
            },
            new Department
            {
                Id = 3,
                Name = "Accounting",
                Description = "Accounting Department",
                IsActive = true
            },
            new Department
            {
                Id = 4,
                Name = "Marketing",
                Description = "Marketing Department",
                IsActive = true
            }
        );
    }
}