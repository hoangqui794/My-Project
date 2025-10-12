using DAL.Data;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly MiniconnectDbContext _context;
        public UserRepository(MiniconnectDbContext context)
        {
            _context = context;
        }
        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context.Users.FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task UppdateAsync(User user)
        {
           _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
