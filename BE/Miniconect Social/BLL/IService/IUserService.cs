using DAL.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace BLL.IService
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(string username, string email , string password);
        string GenerateJwtToken(User user);
        Task<User> AuthenticateAsync(string email, string password);

        Task<bool> GeneratePasswordReset(string email);
        Task<bool> ResetPasswordAsync(string token, string password);

        Task BlacklistTokenAsync(string jti);
        Task<bool> IsTokenBlacklistedAsync(string jti);
    }
}
