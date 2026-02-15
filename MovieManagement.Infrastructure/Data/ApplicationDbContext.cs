using Microsoft.EntityFrameworkCore;
using MovieManagement.Domain.Entities.Class;
using MovieManagement.Domain.Entities.Enums;
using System.Text.Json;

namespace MovieManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Movie> Movies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Directors)
                .IsRequired()
                .HasMaxLength(100);

            // Store Actors as JSON in SQL Server
            entity.Property(e => e.Actors)

                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.ImageUrl)

                .HasColumnType("nvarchar(max)");

            entity.Property(e => e.Genre)
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.ReleaseDate)
                .IsRequired();

            entity.Property(e => e.Runtime)
                .IsRequired();

            entity.Property(e => e.Rating)
                .HasColumnType("decimal(3,1)");

            entity.HasIndex(e => e.ReleaseDate)
               .HasDatabaseName("IX_Movies_ReleaseDate");
        });
    }
}