using Microsoft.EntityFrameworkCore;
using SGUDaltumAPI.Models;

namespace SGUDaltumAPI.Data
{
    public class SGUDbContext : DbContext
    {
        public SGUDbContext(DbContextOptions<SGUDbContext> options) : base(options) { }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}
