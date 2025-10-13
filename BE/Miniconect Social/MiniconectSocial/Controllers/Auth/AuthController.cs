
namespace MiniconectSocial.Controllers.Auth
{
    [ApiController]
    [Route("api/v1/")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        public AuthController(IUserService userService) 
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _userService.RegisterAsync(dto.UserName, dto.Email, dto.Password);
            if (!result) 
            {
                return BadRequest("Email đã tồn tại");
            }
            return Ok("Đăng ký thành công!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {

            var user = await _userService.AuthenticateAsync(dto.Email, dto.Password);
            if (user == null) 
            {
                return Unauthorized("Sai email hoặc mật khẩu");
            }
            var token = _userService.GenerateJwtToken(user);
            return Ok(new {
                Token = token,
                id = user.Id,
                Email = user.Email,
                UserName = user.Username,
                PictureUrl = user.Profilepictureurl,
                Bio = user.Bio,
                CreatAt = user.Createdat,
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var result = await _userService.GeneratePasswordReset(dto.Email);
            if (!result) return BadRequest("Email ko tồn tại or lỗi gửi Email");
            //return Ok("Vui lòng kiểm tra email để đặt lại mật khẩu");
            return Ok(new
            {
                message = "Vui lòng kiểm tra email để đặt lại mật khẩu"

            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _userService.ResetPasswordAsync(dto.Token, dto.NewPassword);
            if (!result) return BadRequest("Token không hợp lệ hoặc đã hết hạn.");
            return Ok("Đổi mật khẩu thành công!");
        }


        [HttpPost("logout")]
        [Authorize]
     
        public async Task<IActionResult> Logout()
        {
           
                // Lấy Jti (định danh duy nhất của token) từ claims của người dùng hiện tại
                var jti = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
                if (string.IsNullOrEmpty(jti)) {
                    return BadRequest("Token không hợp lệ.");
            }
            await _userService.BlacklistTokenAsync(jti);
            
            
            return Ok("Đăng xuất thành công");
        }


    }
}
