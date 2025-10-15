namespace MiniconectSocial.DTos.user
{
    public class UpdateUserDto
    {
        [Required(ErrorMessage = "Tên người dùng không được để trống.")]
        [StringLength(256)]
        public string? UserName { get; set; }
        [StringLength(512)]
        public string? PictureUrl { get; set; }
        [StringLength(1024)]    
        public string? Bio { get; set; }
    }
}
