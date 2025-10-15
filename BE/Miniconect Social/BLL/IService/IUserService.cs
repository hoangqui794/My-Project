public interface IUserService
{
    Task<UserProfileDto?> GetUserProfileByIdAsync(string userId);
    Task<UserProfileDto?> GetUserProfileByUsernameAsync(string username);
    Task<bool> UpdateUserProfileAsync(string userId, UpdateUserDto dto);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    Task<List<User>> SearchUsersAsync(string query);
}