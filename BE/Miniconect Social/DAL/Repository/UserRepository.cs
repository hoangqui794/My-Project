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
            return await _context.Users.AsNoTracking().
                Include(u => u.Followers).
                Include(u => u.Followings).
                Include(u => u.PostsNavigation)
                .Include(u => u.Comments)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => EF.Functions.ILike(u.Username, $"{username}"));
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<List<User>> SearchUsersAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<User>();
            }
            return await _context.Users.AsNoTracking()
                .Where(u => EF.Functions.ILike(u.Username, $"{query}") || EF.Functions.ILike(u.Email, $"{query}"))
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(User user)
        {
            //_context.Users.Update(user);
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
            if (existingUser == null) return false;
            existingUser.Username = user.Username;
            existingUser.Bio = user.Bio;
            existingUser.Profilepictureurl = user.Profilepictureurl;
            existingUser.Passwordhash = user.Passwordhash;
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

        public async Task<bool> FollowAsync(string userId, string targetUserId)
        {
            if (userId == targetUserId)
            {
                return false; // Không thể follow chính mình
            }
            bool isFollowing = await _context.Users
               .Where(u => u.Id == userId)
               .SelectMany(u => u.Followings)
               .AnyAsync(f => f.Id == targetUserId);
            if (isFollowing)
            {
                return false; // Đã follow rồi
            }
            var user = await _context.Users.Include(u => u.Followers).FirstOrDefaultAsync(u => u.Id == userId);
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);
            if (user == null || targetUser == null) return false;
            user.Followings.Add(targetUser);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnfollowAsync(string userId, string targetUserId)
        {
            bool isFollowing = await _context.Users
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Followings)
                .AnyAsync(f => f.Id == targetUserId);
            if (!isFollowing) return false; // Chưa follow nên không thể unfollow
            var user = await _context.Users.Include(u => u.Followings).FirstOrDefaultAsync(u => u.Id == userId);
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == targetUserId);
            if (user == null || targetUser == null) return false;

            user.Followings.Remove(targetUser);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}