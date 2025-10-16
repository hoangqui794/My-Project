
namespace MiniconectSocial.Controllers.Users
{
    [Authorize]
    [ApiController]
    [Route("api/v1/users")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Hàm tiện ích để lấy User ID của người đang đăng nhập từ JWT Token
        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            var userProfile = await _userService.GetUserProfileByIdAsync(userId);
            if (userProfile == null)
            {
                return NotFound("Hồ sơ không tồn tại.");
            }
            return Ok(userProfile);
        }

        // 2. GET: api/v1/users/{username} - Xem hồ sơ công khai của người khác
        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProfileByUsername(string username)
        {
            var userProfile = await _userService.GetUserProfileByUsernameAsync(username);
            if (userProfile == null)
            {
                return NotFound("Người cần tìm không tồn tại.");
            }
            return Ok(userProfile);
        }

        // 3. PUT: api/v1/users/me - Cập nhật hồ sơ cá nhân
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateUserDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            try
            {
                var result = await _userService.UpdateUserProfileAsync(userId, dto);
                if (!result)
                {
                    return StatusCode(500, "Cập nhật hồ sơ thất bại.");
                }
                return Ok("Cập nhật thành công");
            }
            catch (InvalidOperationException ex)
            {
                // Xử lý lỗi trùng lặp Username từ Service
                return Conflict(ex.Message);
            }
            catch (FileLoadException ex) // Ngoại lệ tùy chỉnh cho lỗi file
            {
                return BadRequest(ex.Message);
            }
        }

        // 4. PUT: api/v1/users/me/password - Đổi mật khẩu
        [HttpPost("me/password")]
        public async Task<IActionResult> ChangeMyPassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            var result = await _userService.ChangePasswordAsync(userId, dto);
            if (!result)
            {
                return BadRequest("Mật khẩu hiện tại không đúng hoặc cập nhật thất bại.");
            }
            return Ok("Đổi mật khẩu thành công.");
        }

        // 5. GET: api/v1/users/search?query=abc - Tìm kiếm người dùng
        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Tham số tìm kiếm không được để trống.");
            }
            var users = await _userService.SearchUsersAsync(query);
            //var result = users.Select(u => new
            //{
            //    u.Id,
            //    u.Username,
            //    u.Profilepictureurl,
            //    u.Bio
            //});
            var result = users.Select(u => new UserProfileDto
            {
                Id = u.Id,
                UserName = u.Username,
                Email = u.Email,
                Bio = u.Bio,
                PictureUrl = u.Profilepictureurl,
                CreatedAt = u.Createdat
            }).ToList();
            return Ok(result);
        }

    }
}

