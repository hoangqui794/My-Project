namespace MiniconectSocial.DTos.post
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public string Content { get; set; }
        public DateTime Createdat { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string? AuthorAvatar { get; set; }
    }
}
