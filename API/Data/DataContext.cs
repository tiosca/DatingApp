﻿using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : IdentityDbContext <AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>().HasMany(ur => ur.UserRoles).WithOne(u => u.User).HasForeignKey(ur => ur.UserId).IsRequired();

        builder.Entity<AppRole>().HasMany(ur => ur.UserRoles).WithOne(u => u.Role).HasForeignKey(ur => ur.RoleId).IsRequired();

        builder.Entity<UserLike>().HasKey(x => new {x.SourceUserId, x.TargetUserId});

        builder.Entity<UserLike>().HasOne(x => x.SourceUser).WithMany(l => l.LikedUsers).HasForeignKey(x => x.SourceUserId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>().HasOne(x => x.TargetUser).WithMany(l => l.LikedByUsers).HasForeignKey(x => x.TargetUserId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>().HasOne(u => u.Recipient).WithMany(m => m.MessagesRecieved).OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>().HasOne(u => u.Sender).WithMany(m => m.MessagesSent).OnDelete(DeleteBehavior.Restrict);
    }
}
