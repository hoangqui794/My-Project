namespace MiniconectSocial.DTos.user
{
    public class UpdateUserDto
    {
        public string? UserName { get; set; }
        public string? Bio { get; set; }

        // THÊM: Dùng IFormFile để nhận file ảnh từ client
        public IFormFile? ProfilePictureFile { get; set; }
    }
}
