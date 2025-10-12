using System;
using System.Collections.Generic;

namespace DAL.Data;

public partial class Comment
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public DateTime Createdat { get; set; }

    public string Authorid { get; set; } = null!;

    public int Postid { get; set; }

    public virtual User Author { get; set; } = null!;

    public virtual Post Post { get; set; } = null!;
}
