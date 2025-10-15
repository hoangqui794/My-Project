

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;

        public UserService(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
        }

        private static UserProfileDto MapToUserProfileDto(User user)
        {
            return new UserProfileDto
            {
                Id = user.Id,
                UserName = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                PictureUrl = user.Profilepictureurl,
                CreatedAt = user.Createdat
            };
        }   

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var isPasswordValid = await _authService.CheckPasswordAsync( user, dto.CurrentPassword);
            if(!isPasswordValid) return false;

            var newPasswordHash = _authService.HashPasswordString(dto.NewPassword);
            user.Passwordhash = newPasswordHash;

            return await _userRepository.UpdateAsync(user);

        }

        public async Task<UserProfileDto?> GetUserProfileByIdAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user == null ? null : MapToUserProfileDto(user);
        }


        public async Task<UserProfileDto?> GetUserProfileByUsernameAsync(string username)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            return user == null ? null : MapToUserProfileDto(user);
        }

        public async Task<List<User>> SearchUsersAsync(string query)
        {
            var user = await _userRepository.SearchUsersAsync(query);
            return user;
        }

        public async Task<bool> UpdateUserProfileAsync(string userId, UpdateUserDto dto)
        {
            var user = await  _userRepository.GetByIdAsync(userId);
            if (user == null) return false;
            if (!string.IsNullOrEmpty(dto.UserName) && user.Username != dto.UserName)
            {
                var existingUser = await _userRepository.GetByUsernameAsync(dto.UserName);
                if (existingUser != null) 
                {
                    // Ném Exception để Controller xử lý mã lỗi 409 Conflict
                    throw new InvalidOperationException("Tên người dùng đã tồn tại.");
                }
                user.Username = dto.UserName;
            }
            user.Bio = dto.Bio;
            user.Profilepictureurl = dto.PictureUrl;

            return await _userRepository.UpdateAsync(user);
        }
    }
}
