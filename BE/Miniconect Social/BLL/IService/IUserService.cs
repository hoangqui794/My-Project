public interface IUserService
{
    Task<User?> GetUserProfileByIdAsync(string userId);
    Task<User?> GetUserProfileByUsernameAsync(string username);
    Task<bool> UpdateUserProfileAsync(string userId, string username, string bio, IFormFile Profilepictureurl);
    Task<bool> ChangePasswordAsync(string userId,string currentPassword, string newPassword);
    Task<List<User>> SearchUsersAsync(string query);
    Task<bool> FollowAsync(string userId, string targetUserId);
    Task<bool> UnfollowAsync(string userId, string targetUserId);
}