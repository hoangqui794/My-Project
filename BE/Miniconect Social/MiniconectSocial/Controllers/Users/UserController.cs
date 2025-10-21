using MiniconectSocial.DTos.post;

namespace MiniconectSocial.Controllers.Users
{
    [Authorize]
    [ApiController]
    [Route("api/v1/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHubContext<UserHub> _userHubContext;
        private readonly IPostService _postService;

        public UserController(IUserService userService, IHubContext<UserHub> userhub, IPostService postService)
        {
            _userService = userService;
            _userHubContext = userhub;
            _postService = postService;
        }

        // Hàm tiện ích để lấy User ID của người đang đăng nhập từ JWT Token
        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
              ?? User.FindFirstValue("sub");
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var user = GetCurrentUserId();
            if (user == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            var userProfile = await _userService.GetUserProfileByIdAsync(user);
            if (userProfile == null)
            {
                return NotFound("Hồ sơ không tồn tại.");
            }
            return Ok(new UserProfileDto
            {
                Id = userProfile.Id,
                UserName = userProfile.Username,
                Email = userProfile.Email,
                PictureUrl = userProfile.Profilepictureurl,
                Bio = userProfile.Bio,
                CreatedAt = userProfile.Createdat,
                PostCount = userProfile.PostsNavigation?.Count ?? 0,
                FollowersCount = userProfile.Followers?.Count ?? 0,
                FollowingsCount = userProfile.Followings?.Count ?? 0
            });
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
        public async Task<IActionResult> UpdateMyProfile([FromForm] UpdateUserDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            try
            {
                var result = await _userService.UpdateUserProfileAsync(userId, dto.UserName, dto.Bio, dto.ProfilePictureFile);
                if (!result)
                {
                    return StatusCode(500, "Cập nhật hồ sơ thất bại.");
                }
                var updated = await _userService.GetUserProfileByIdAsync(userId);
                if (updated != null)
                {
                    var payload = new
                    {
                        id = updated.Id,
                        username = updated.Username,
                        pictureUrl = updated.Profilepictureurl,
                        bio = updated.Bio,
                        createdAt = updated.Createdat,
                        followersCount = updated.Followers?.Count ?? 0,
                        followingsCount = updated.Followings?.Count ?? 0
                    };
                    await _userHubContext.Clients.Group(userId).SendAsync("ProfileUpdated", payload);

                    if (updated.Followers != null)
                    {
                        foreach (var follower in updated.Followers)
                        {
                            await _userHubContext.Clients.Group(follower.Id).SendAsync("ProfileUpdated", new
                            {
                                id = updated.Id,
                                username = updated.Username,
                                pictureUrl = updated.Profilepictureurl,
                                bio = updated.Bio
                            });
                        }
                    }
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
            var result = await _userService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
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

        [HttpPost("{userId}/follow")]
        public async Task<IActionResult> FollowUser(string userId)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            if (currentUserId == userId)
            {
                return BadRequest("Không thể theo dõi chính mình.");
            }
            var result = await _userService.FollowAsync(currentUserId, userId);
            if (!result)
            {
                return BadRequest("Theo dõi thất bại. Có thể bạn đã theo dõi người này.");
            }
            var targetProfile = await _userService.GetUserProfileByIdAsync(userId);
            var sourceProfile = await _userService.GetUserProfileByIdAsync(currentUserId);

            var targetPayload = new
            {
                type = "follow",
                byUserId = currentUserId,
                follwersCount = targetProfile.Followers?.Count ?? 0
            };

            var sourcePayload = new
            {
                type = "follow",
                toUserId = userId,
                followingsCount = sourceProfile.Followings?.Count ?? 0
            };

            await _userHubContext.Clients.Group(userId).SendAsync("FollowChanged", targetPayload);
            await _userHubContext.Clients.Group(currentUserId).SendAsync("FollowChanged", sourcePayload);

            return Ok("Đã theo dõi người dùng.");
        }

        [HttpPost("{userId}/unfollow")]
        public async Task<IActionResult> UnfollowUser(string userId)
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            if (currentUserId == userId)
            {
                return BadRequest("Không thể bỏ theo dõi chính mình.");
            }
            var result = await _userService.UnfollowAsync(currentUserId, userId);
            if (!result)
            {
                return BadRequest("Bỏ theo dõi thất bại. Có thể bạn chưa theo dõi người này.");
            }

            var targetProfile = await _userService.GetUserProfileByIdAsync(userId);
            var sourceProfile = await _userService.GetUserProfileByIdAsync(currentUserId);
            var targetPayload = new
            {
                type = "unfollow",
                byUserId = currentUserId,
                follwersCount = targetProfile.Followers?.Count ?? 0
            };
            var sourcePayload = new
            {
                type = "unfollow",
                toUserId = userId,
                followingsCount = sourceProfile.Followings?.Count ?? 0
            };
            await _userHubContext.Clients.Group(userId).SendAsync("FollowChanged", targetPayload);
            await _userHubContext.Clients.Group(currentUserId).SendAsync("FollowChanged", sourcePayload);
            return Ok("Đã bỏ theo dõi người dùng.");
        }

        [HttpGet("me/posts")]
        public async Task<IActionResult> GetMyPosts()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized("Không thể xác định người dùng.");
            }
            var posts = await _postService.GetByUserIdAsync(userId);
            var result = posts.Select(posts => new PostDto
            {
                Id = posts.Id,
                Content = posts.Content,
                Imageurl = posts.Imageurl,
                Createdat = posts.Createdat,
                Authorid = posts.Authorid,
                Authorname = posts.Author?.Username ?? "",
                AuthorAvatar = posts.Author?.Profilepictureurl,
                CommentCount = posts.Comments?.Count ?? 0,
                likeCount = posts.Users?.Count ?? 0
            }).ToList();

            return Ok(result);
        }
    }
}