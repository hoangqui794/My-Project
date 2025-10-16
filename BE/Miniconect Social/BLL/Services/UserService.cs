

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        private readonly IFileStorageService _fileStorageService;

        public UserService(IUserRepository userRepository, IAuthService authService, IFileStorageService fileStorageService)
        {
            _userRepository = userRepository;
            _authService = authService;
            _fileStorageService = fileStorageService;
        }


        public async Task<bool> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var isPasswordValid = await _authService.CheckPasswordAsync( user, currentPassword);
            if(!isPasswordValid) return false;

            var newPasswordHash = _authService.HashPasswordString(newPassword);
            user.Passwordhash = newPasswordHash;

            return await _userRepository.UpdateAsync(user);

        }

        

        public async Task<User?> GetUserProfileByIdAsync(string userId)
        {
               User? user = await _userRepository.GetByIdAsync(userId);
            return user;
        }


        public async Task<User?> GetUserProfileByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

        public async Task<List<User>> SearchUsersAsync(string query)
        {
            var user = await _userRepository.SearchUsersAsync(query);
            return user;
        }

        public async Task<bool> UnfollowAsync(string userId, string targetUserId)
        {
           return await _userRepository.UnfollowAsync(userId, targetUserId);
        }
        public async Task<bool> FollowAsync(string userId, string targetUserId)
        {
            return await _userRepository.FollowAsync( userId, targetUserId);
        }

        public async Task<bool> UpdateUserProfileAsync(string userId, string username, string bio, IFormFile  profilePicturePath)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;
            if (!string.IsNullOrEmpty(username) && user.Username != username)
            {
                var existingUser = await _userRepository.GetByUsernameAsync(username);
                if (existingUser != null)
                {
                    // Ném Exception để Controller xử lý mã lỗi 409 Conflict
                    throw new InvalidOperationException("Tên người dùng đã tồn tại.");
                }
                user.Username = username;
            }
            user.Bio = bio;
            if (profilePicturePath !=null)
            {
                // Lưu file ảnh mới lên server/cloud và lấy URL
                var newPictureUrl = await _fileStorageService.SaveFileAsync(profilePicturePath, "profile-pictures");
                if (string.IsNullOrEmpty(newPictureUrl))
                {
                    throw new FileLoadException("Lỗi khi lưu ảnh đại diện.");
                }
                // Lưu URL ảnh mới vào database
                user.Profilepictureurl = newPictureUrl;
            }
            return await _userRepository.UpdateAsync(user);
        }
    }
}
