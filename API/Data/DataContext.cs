using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserLike>().HasKey(x => new {x.SourceUserId, x.TargetUserId});

        builder.Entity<UserLike>().HasOne(x => x.SourceUser).WithMany(l => l.LikedUsers).HasForeignKey(x => x.SourceUserId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>().HasOne(x => x.TargetUser).WithMany(l => l.LikedByUsers).HasForeignKey(x => x.TargetUserId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Message>().HasOne(u => u.Recipient).WithMany(m => m.MessagesRecieved).OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Message>().HasOne(u => u.Sender).WithMany(m => m.MessagesSent).OnDelete(DeleteBehavior.Restrict);
    }
}
