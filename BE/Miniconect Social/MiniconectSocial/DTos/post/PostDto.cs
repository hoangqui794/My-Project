namespace MiniconectSocial.DTos.post
{
    public class PostDto
    {
        public int Id { get; set; } 
        public string Content { get; set; }
        public string? Imageurl { get; set; }

        public DateTime Createdat { get; set; }

        public string Authorid { get; set; }
        public string Authorname { get; set; }
        public string? AuthorAvatar { get; set; }

        public int CommentCount { get; set; }
        public int likeCount { get; set; }
    }
}
