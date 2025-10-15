namespace BLL.IService
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(string username, string email , string password);
        string GenerateJwtToken(User user);
        Task<User> AuthenticateAsync(string email, string password);

        Task<bool> GeneratePasswordReset(string email);
        Task<bool> ResetPasswordAsync(string token, string password);

        Task BlacklistTokenAsync(string jti);
        Task<bool> IsTokenBlacklistedAsync(string jti);
        Task<bool> CheckPasswordAsync(User user, string password);

        // Phương thức Hash công khai (cần cho ChangePasswordAsync trong UserService)
        string HashPasswordString(string password);

    }
}
