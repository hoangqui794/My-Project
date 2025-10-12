using DAL.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.IRepository
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task<User> GetByIdAsync(string id);
        Task UppdateAsync(User user);
    }
}
