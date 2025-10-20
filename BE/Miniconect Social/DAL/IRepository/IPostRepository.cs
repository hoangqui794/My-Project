using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace DAL.IRepository
{
    public interface IPostRepository
    {
        Task<Post> CreateAsync(Post post);
        Task<Post> UpdateAsync(Post post);
        Task<bool> DeleteAsync(int postId, string userId);
        Task<Post> GetByIdAsync(int postId);
        Task<List<Post>> GetByUserIdAsync(string userId);
        Task<List<Post>> GetFeedAsync(int skip =0 , int take = 20);


       Task<bool> LikePostAsync (int postId, string userId);
        Task<bool> UnlikePostAsync(int postId, string userId);
        Task<List<Comment>> GetCommentsAsync(int postId);
        Task<Comment> AddCommentAsync(int postId, string userId, string content);
        Task<bool> DeleteCommentAsync(int postId ,int commentId, string userId);

    }
}
