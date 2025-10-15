namespace DAL.IRepository
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task<User> GetByIdAsync(string id);
        //Task UppdateAsync(User user);

        Task<User> GetByUsernameAsync(string username);
        // Cập nhật User
        Task<bool> UpdateAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<List<User>> SearchUsersAsync(string query);
        Task<bool> CheckAndUpdatePasswordAsync(string userId, string currentPasswordHash, string newPasswordHash);
        // Lưu thay đổi vào DBContext (có thể nằm trong Generic Repository nếu bạn có)
        Task<int> SaveChangesAsync();
    }
}
