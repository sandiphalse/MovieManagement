using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Migrations;
using MovieManagement.Infrastructure.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Numerics;
using System.Runtime.Intrinsics.X86;

namespace MovieManagement.Infrastructure;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // LocalDB connection string
        optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=MovieManagementDb;Trusted_Connection=True;TrustServerCertificate=True;");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}