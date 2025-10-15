

namespace DAL.Data;

public partial class User
{
    public string Id { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Passwordhash { get; set; } = null!;

    public string? Profilepictureurl { get; set; }

    public string? Bio { get; set; }

    public DateTime Createdat { get; set; }

    public virtual ICollection<Chatmessage> ChatmessageReceivers { get; set; } = new List<Chatmessage>();

    public virtual ICollection<Chatmessage> ChatmessageSenders { get; set; } = new List<Chatmessage>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Post> PostsNavigation { get; set; } = new List<Post>();

    public virtual ICollection<User> Followers { get; set; } = new List<User>();

    public virtual ICollection<User> Followings { get; set; } = new List<User>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
