namespace DAL.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly MiniconnectDbContext _context;

        public PostRepository(MiniconnectDbContext context)
        {
            _context = context;
        }

        public async Task<Post> CreateAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<Post> UpdateAsync(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<bool> DeleteAsync(int postId, string userId)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == postId && p.Authorid == userId);
            if (post == null) return false;
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Post> GetByIdAsync(int postId)
        {
            return await _context.Posts.AsNoTracking()
                .Include(p => p.Author)
                .Include(p => p.Users)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<List<Post>> GetByUserIdAsync(string userId)
        {
            return await _context.Posts.AsNoTracking()
                .Include(p => p.Author)
                .Include(u => u.Users)
                .Include(p => p.Comments)
                .Where(p => p.Authorid == userId)
                .OrderByDescending(p => p.Createdat)
                .ToListAsync();
        }

        public async Task<List<Post>> GetFeedAsync(int skip = 0, int take = 20)
        {
            return await _context.Posts
                  .Include(p => p.Author)
                  .Include(p => p.Users)
                    .Include(p => p.Comments)
                  .OrderByDescending(p => p.Createdat)
                  .Skip(skip)
                  .Take(take)
                  .ToListAsync();
        }

        public async Task<bool> LikePostAsync(int postId, string userId)
        {
            var post = await _context.Posts.Include(p => p.Users).FirstOrDefaultAsync(p => p.Id == postId);
            var user = await _context.Users.FindAsync(userId);
            if (post == null || user == null) return false;
            if (post.Users.Any(u => u.Id == userId)) return false;// Already liked

            post.Users.Add(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnlikePostAsync(int postId, string userId)
        {
            var post = await _context.Posts.Include(p => p.Users).FirstOrDefaultAsync(p => p.Id == postId);
            var user = await _context.Users.FindAsync(userId);
            if (post == null || user == null) return false;
            if (!post.Users.Any(u => u.Id == userId)) return false;// Already liked

            post.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Comment>> GetCommentsAsync(int postId)
        {
            return await _context.Comments
                .Include(c => c.Author)
                .Where(c => c.Postid == postId)
                .OrderByDescending(c => c.Createdat)
                .ToListAsync();
        }

        public async Task<Comment> AddCommentAsync(int postId, string userId, string content)
        {
            var post = await _context.Posts.FindAsync(postId);
            var user = await _context.Users.FindAsync(userId);

            if (post == null || user == null) return null;

            var comment = new Comment
            {
                Content = content,
                Createdat = DateTime.UtcNow,
                Authorid = userId,
                Postid = postId
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<bool> DeleteCommentAsync(int postId, int commentId, string userId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.Postid == postId);
            if (comment == null) return false;

            var post = await _context.Posts.FindAsync(postId);
            if (comment.Authorid != userId && (post == null || post.Authorid != userId)) return false;

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}