namespace BLL.DTOs.user
{
    public class UserProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? PictureUrl { get; set; }
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
