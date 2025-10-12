using BLL.IService;
using DAL.Data;
using DAL.IRepository;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        public UserService(IUserRepository userRepository , IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }
   

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) {
                return null;
            }
            var hash = HashPassword(password);
            if (user.Passwordhash != hash)
            {
                return null;
            }
            return user;    
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("UserName", user.Username)
            };

            var secretKey = _configuration["Jwt:SecretKey"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(secretKey) || secretKey.Length < 16)
                throw new Exception("JWT SecretKey bị null hoặc quá ngắn!");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> GeneratePasswordReset(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null) return false;

            var claims = new[]
            {
                new Claim("UserId", user.Id),
                new Claim("Email", user.Username)
            };
            var secretkey = _configuration["Jwt:SecretKey"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretkey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience : audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(15),
                    signingCredentials: creds
                );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            
            var resetLink = $"https://localhost:7273/reset-password?token={tokenString}";
            Console.WriteLine("Gửi email tới"+ email+ ": Link đặt lại mật khẩu:"+ resetLink);


            return true;
        }

        public async Task<bool> RegisterAsync(string username, string email, string password)
        {
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null) { return false; }

            var hash = HashPassword(password);

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = username,
                Email = email,
                Passwordhash = hash,
                Createdat = DateTime.UtcNow,
            };

            await _userRepository.AddUserAsync(user);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string token, string password)
        {
            var handel = new JwtSecurityTokenHandler();
            try
            {
                var secretKey = _configuration["Jwt:SecretKey"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];
                Console.WriteLine($"SecretKey: {secretKey}, Issuer: {issuer}, Audience: {audience}");
                var principal = handel.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer= issuer,
                    ValidAudience= audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                }, out var validatedToken);

                var userId = principal.FindFirst("UserId")?.Value;
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null) {
                    return false;
                }
                user.Passwordhash = HashPassword(password);
                await _userRepository.UppdateAsync(user);
                return true;
            }
            catch (Exception ex) {
                Console.WriteLine("lỗi" + ex.Message);
                return false;
            }
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create()) 
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
