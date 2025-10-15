

namespace DAL.Data;

public partial class Post
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public string? Imageurl { get; set; }

    public DateTime Createdat { get; set; }

    public string Authorid { get; set; } = null!;

    public virtual User Author { get; set; } = null!;

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
