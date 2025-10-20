
namespace BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        public AuthService(IUserRepository userRepository , IConfiguration configuration, IMemoryCache cache)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _memoryCache = cache;
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

        public Task BlacklistTokenAsync(string jti)
        {
            var tokenLifetime = TimeSpan.FromHours(1);
            _memoryCache.Set(jti, "blacklisted", tokenLifetime);
            return Task.CompletedTask;
        }

        public string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("UserName", user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
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
            var resetLink = $"http://localhost:5173/reset-password?token={tokenString}";
            var subject = "Đặt lại mật khẩu Miniconect Social";
            var htmlContent = $@"
                <p>Nhấn vào nút sau để đặt lại mật khẩu:</p>
                <a href='{resetLink}' 
                   style='display:inline-block;padding:10px 20px;background:#1976d2;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;'>
                    <span style='color:#fff;'>Thay đổi mật khẩu</span>
                </a>";
            await SendEmailSmtpAsync(email, subject, htmlContent);
            return true;
        }

        public Task<bool> IsTokenBlacklistedAsync(string jti)
        {
            var isBlacklisted = _memoryCache.TryGetValue(jti, out _);
            return Task.FromResult(isBlacklisted);
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
                bool updateSuccess = await _userRepository.UpdateAsync(user);
                return updateSuccess;
            }
            catch (Exception ex) {
                Console.WriteLine("lỗi" + ex.Message);
                Console.WriteLine("Token validation error: " + ex.ToString());

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

        public async Task SendEmailSmtpAsync(string toEmail, string subject, string htmlContent)
        {
            var host = _configuration["SMTP:Host"];
            var port = int.Parse(_configuration["SMTP:Port"]);
            var username = _configuration["SMTP:Username"];
            var password = _configuration["SMTP:Password"];
            var fromEmail = _configuration["SMTP:FromEmail"];
            var fromName = _configuration["SMTP:FromName"];

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(new MailboxAddress(toEmail, toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlContent };

            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(username, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public Task<bool> CheckPasswordAsync(User user, string password)
        {
           var  inputHash = HashPassword(password);
            bool isValud = user.Passwordhash == inputHash;
            return Task.FromResult(isValud);
        }

        public string HashPasswordString(string password)
        {
            return HashPassword(password);
        }
    }
}
