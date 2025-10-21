using MiniconectSocial.DTos.post;

namespace MiniconectSocial.Controllers.Post
{
    [Route("api/v1/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ILogger<PostController> _logger;
        private readonly IPostService _postService;
        private readonly IHubContext<PostHub> _hubContext;
        private readonly IFileStorageService _fileStorageService;

        public PostController(ILogger<PostController> logger, IPostService postService, IHubContext<PostHub> postHub, IFileStorageService fileStorageService)
        {
            _logger = logger;
            _postService = postService;
            _hubContext = postHub;
            _fileStorageService = fileStorageService;
        }

        //Lấy danh sách bài viết cho feed
        [HttpGet()]
        public async Task<IActionResult> GetPost([FromQuery] int skip = 0, [FromQuery] int take = 20)
        {
            var posts = await _postService.GetFeedAsync(skip, take);
            var result = posts.Select(post => new PostDto
            {
                Id = post.Id,
                Content = post.Content,
                Imageurl = post.Imageurl,
                Createdat = post.Createdat,
                Authorid = post.Authorid,
                Authorname = post.Author!.Username,
                AuthorAvatar = post.Author!.Profilepictureurl,
                CommentCount = post.Comments?.Count ?? 0,
                likeCount = post.Users?.Count ?? 0
            }).ToList();
            return Ok(result);
        }

        //Lấy chi tiết bài viết theo Id
        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostById(int postId)
        {
            var post = await _postService.GetPostByIdAsync(postId);
            if (post == null)
            {
                return NotFound("Không tìm thấy bài viết");
            }
            var result = new PostDto
            {
                Id = post.Id,
                Content = post.Content,
                Imageurl = post.Imageurl,
                Createdat = post.Createdat,
                Authorid = post.Authorid,
                Authorname = post.Author.Username,
                AuthorAvatar = post.Author!.Profilepictureurl,
                CommentCount = post.Comments?.Count ?? 0,
                likeCount = post.Users?.Count ?? 0
            };
            return Ok(result);
        }

        //Đăng bài viết mới
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto dto, IFormFile? imageFile)
        {
            string imageUrl = null;
            if (imageFile != null && imageFile.Length > 0)
            {
                imageUrl = await _fileStorageService.SaveFileAsync(imageFile, "posts");
            }
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var post = await _postService.CreatePostAsync(userId, dto.Content, imageUrl);
            if (userId == null)
            {
                return Unauthorized("Không tìm thấy người dùng");
            }

            var postWithAuthor = await _postService.GetPostByIdAsync(post.Id);
            var result = new PostDto
            {
                Id = postWithAuthor.Id,
                Content = postWithAuthor.Content,
                Imageurl = postWithAuthor.Imageurl,
                Createdat = postWithAuthor.Createdat,
                Authorid = postWithAuthor.Authorid,
                Authorname = postWithAuthor.Author?.Username ?? "",
                AuthorAvatar = postWithAuthor.Author?.Profilepictureurl,
                CommentCount = postWithAuthor.Comments?.Count ?? 0,
                likeCount = postWithAuthor.Users?.Count ?? 0
            };

            await _hubContext.Clients.All.SendAsync("NewPost", result);
            return Ok(result);
        }

        //Like Bài  Viết
        [Authorize]
        [HttpPost("{postId}/like")]
        public async Task<IActionResult> LikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _postService.LikePostAsync(postId, userId);
            await _hubContext.Clients.All.SendAsync("PostLiked", new
            {
                PostId = postId,
                UserId = userId
            });
            return result ? Ok() : BadRequest("Không thể like bài viết");
        }

        [Authorize]
        [HttpPost("{postId}/unlike")]
        public async Task<IActionResult> UnlikePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _postService.UnlikePostAsync(postId, userId);
            await _hubContext.Clients.All.SendAsync("PostUnliked", new
            {
                PostId = postId,
                UserId = userId
            });
            return result ? Ok() : BadRequest("Không thể Unlike bài viết");
        }

        //Lấy Bình luận của bài viết
        [HttpGet("{postId}/comments")]
        public async Task<ActionResult<List<CommentDto>>> GetComments(int postId)
        {
            var comments = await _postService.GetCommentsAsync(postId);
            var result = comments.Select(c => new CommentDto
            {
                Id = c.Id,
                PostId = c.Postid,
                AuthorId = c.Authorid,
                Content = c.Content,
                Createdat = c.Createdat
            }).ToList();

            return Ok(result);
        }

        //Thêm bình luận vào bài viết
        [Authorize]
        [HttpPost("{postId}/comments")]
        public async Task<ActionResult<CommentDto>> AddComment(int postId, [FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var comment = await _postService.AddCommentAsync(postId, userId, dto.content);
            var result = new CommentDto
            {
                Id = comment.Id,
                PostId = comment.Postid,
                AuthorId = comment.Authorid,
                Content = comment.Content,
                Createdat = comment.Createdat,
                AuthorName = comment.Author!.Username,
                AuthorAvatar = comment.Author!.Profilepictureurl
            };
            var post = await _postService.GetPostByIdAsync(postId);
            if (post != null)
            {
                await _hubContext.Clients.All.SendAsync("NewComment", new
                {
                    PostId = postId,
                    CommentId = comment.Id,
                    AuthorId = comment.Authorid,
                    Content = comment.Content,
                    Createdat = comment.Createdat,
                    AuthorName = comment.Author!.Username,
                    AuthorAvatar = comment.Author!.Profilepictureurl
                });
            }
            return Ok(result);
        }

        //Xoa bình luận khỏi bài viết
        [Authorize]
        [HttpDelete("{postId}/comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(int postId, int commentId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _postService.DeleteCommentAsync(postId, commentId, userId);
            await _hubContext.Clients.All.SendAsync("CommentDeleted", new
            {
                PostId = postId,
                CommentId = commentId
            });
            return result ? Ok() : BadRequest("Không thể xóa bình luận");
        }

        [Authorize]
        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost(int postId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _postService.DeletePostAsync(userId, postId);
            if (!result)
            {
                return BadRequest("Không thể xóa bài viết");
            }
            await _hubContext.Clients.All.SendAsync("PostDeleted", new
            {
                PostId = postId
            });

            return NoContent();
        }
    }
}