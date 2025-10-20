

namespace BLL.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        public PostService(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }
        public async Task<Post> CreatePostAsync(string userId, string content, string Imageurl)
        {
            var post = new Post
            {
                Authorid = userId,
                Content = content,
                Imageurl = Imageurl,
                Createdat = DateTime.UtcNow,
            };
            return await _postRepository.UpdateAsync(post);
        
        }
        public async Task<Post> UpdatePostAsync(string userId, int postId, string content, string Imageurl)
        {
            var post = await _postRepository.GetByIdAsync(postId);
            if (post == null || post.Authorid != userId) {
                return null;
            }
            post.Content = content;
            post.Imageurl = Imageurl;
             return await _postRepository.UpdateAsync(post);
        }

        public async Task<bool> DeletePostAsync(string userId, int postId)
        {
            return await _postRepository.DeleteAsync(postId, userId);
        }

        public async Task<List<Post>> GetByUserIdAsync(string userId)
        {
            return await _postRepository.GetByUserIdAsync(userId);
        }

        public async Task<List<Post>> GetFeedAsync(int skip = 0, int take = 20)
        {
            return await _postRepository.GetFeedAsync(skip, take);
        }

        public async Task<Post> GetPostByIdAsync(int postId)
        {
            return await _postRepository.GetByIdAsync(postId);
        }

        public async Task<bool> LikePostAsync(int postId, string userId)
        {
            return await _postRepository.LikePostAsync(postId, userId);
        }

        public async Task<bool> UnlikePostAsync(int postId, string userId)
        {
            return await _postRepository.UnlikePostAsync(postId, userId);
        }

        public async Task<List<Comment>> GetCommentsAsync(int postId)
        {
           return await _postRepository.GetCommentsAsync(postId);
        }

        public async Task<Comment> AddCommentAsync( int postId,string userId, string content)
        {
            return await _postRepository.AddCommentAsync(postId,userId, content);
        }

        public async Task<bool> DeleteCommentAsync(int postId, int commentId, string userId)
        {
            return await _postRepository.DeleteCommentAsync(postId, commentId, userId);
        }
    }
}
