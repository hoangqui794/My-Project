namespace BLL.IService
{
    public interface IPostService
    {
        Task<Post> CreatePostAsync(string userId, string content , string Imageurl);
        Task<Post> UpdatePostAsync(string userId, int postId, string content , string Imageurl);
        Task<bool> DeletePostAsync(string userId, int postId);
        Task<Post> GetPostByIdAsync(int postId);
        Task<List<Post>> GetByUserIdAsync(string userId);
        Task<List<Post>> GetFeedAsync(int skip = 0, int take =20);

        Task<bool> LikePostAsync(int postId,string userId);
        Task<bool> UnlikePostAsync(int postId, string userId);
        Task<List<Comment>> GetCommentsAsync(int postId);
        Task<Comment> AddCommentAsync(int postId, string userId, string content);
        Task<bool> DeleteCommentAsync(int postId , int commentId, string userId);
    }
}
