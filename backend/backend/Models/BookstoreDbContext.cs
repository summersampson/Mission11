using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models; // For the Book model reference


namespace backend.Models
{
    public class BookstoreDbContext : DbContext
    {
        public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options)
        : base(options) { }

        public DbSet<Book> Books { get; set; }
    }
}