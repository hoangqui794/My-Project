
namespace DAL.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly MiniconnectDbContext _context;
        public UserRepository(MiniconnectDbContext context)
        {
            _context = context;
        }
        public async Task AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

       

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<List<User>> SearchUsersAsync(string query)
        {
            if(string.IsNullOrWhiteSpace(query))
            {
                return new List<User>();
            }
            var loweredQuery = query.ToLower();
            return await   _context.Users.AsNoTracking()
                .Where(u => u.Username.ToLower().Contains(loweredQuery) || u.Email.ToLower().Contains(loweredQuery))
                .ToListAsync();

        }

        public async Task<bool> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            return await SaveChangesAsync() > 0;
        }
        public Task<bool> CheckAndUpdatePasswordAsync(string userId, string currentPasswordHash, string newPasswordHash)
        {
            throw new NotImplementedException("Logic kiểm tra mật khẩu đã được chuyển lên tầng Service.");
        }
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
   
    }
}
