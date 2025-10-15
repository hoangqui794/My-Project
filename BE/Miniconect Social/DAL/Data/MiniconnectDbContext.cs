

namespace DAL.Data;

public partial class MiniconnectDbContext : DbContext
{
    public MiniconnectDbContext()
    {
    }

    public MiniconnectDbContext(DbContextOptions<MiniconnectDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chatmessage> Chatmessages { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<User> Users { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//        => optionsBuilder.UseNpgsql("Host=localhost;Database=miniconnect_db;Username=postgres;Password=a");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chatmessage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("chatmessages_pkey");

            entity.ToTable("chatmessages");

            entity.HasIndex(e => e.Receiverid, "ix_chatmessages_receiverid");

            entity.HasIndex(e => e.Senderid, "ix_chatmessages_senderid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Isread)
                .HasDefaultValue(false)
                .HasColumnName("isread");
            entity.Property(e => e.Receiverid).HasColumnName("receiverid");
            entity.Property(e => e.Senderid).HasColumnName("senderid");
            entity.Property(e => e.Sentat)
                .HasDefaultValueSql("now()")
                .HasColumnName("sentat");

            entity.HasOne(d => d.Receiver).WithMany(p => p.ChatmessageReceivers)
                .HasForeignKey(d => d.Receiverid)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_chatmessages_receiver");

            entity.HasOne(d => d.Sender).WithMany(p => p.ChatmessageSenders)
                .HasForeignKey(d => d.Senderid)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_chatmessages_sender");
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("comments_pkey");

            entity.ToTable("comments");

            entity.HasIndex(e => e.Authorid, "ix_comments_authorid");

            entity.HasIndex(e => e.Postid, "ix_comments_postid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Authorid).HasColumnName("authorid");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("now()")
                .HasColumnName("createdat");
            entity.Property(e => e.Postid).HasColumnName("postid");

            entity.HasOne(d => d.Author).WithMany(p => p.Comments)
                .HasForeignKey(d => d.Authorid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_comments_users");

            entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                .HasForeignKey(d => d.Postid)
                .HasConstraintName("fk_comments_posts");
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("posts_pkey");

            entity.ToTable("posts");

            entity.HasIndex(e => e.Authorid, "ix_posts_authorid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Authorid).HasColumnName("authorid");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("now()")
                .HasColumnName("createdat");
            entity.Property(e => e.Imageurl).HasColumnName("imageurl");

            entity.HasOne(d => d.Author).WithMany(p => p.PostsNavigation)
                .HasForeignKey(d => d.Authorid)
                .HasConstraintName("fk_posts_users");
        });
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("notifications_pkey");

            entity.ToTable("notifications");

            entity.HasIndex(e => e.UserId, "ix_notifications_userid");
            entity.HasIndex(e => e.IsRead, "ix_notifications_isread");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("userid");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.ReferenceId).HasColumnName("referenceid");
            entity.Property(e => e.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("isread");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("createdat");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_notifications_users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "users_username_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Bio).HasColumnName("bio");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("now()")
                .HasColumnName("createdat");
            entity.Property(e => e.Email)
                .HasMaxLength(256)
                .HasColumnName("email");
            entity.Property(e => e.Passwordhash).HasColumnName("passwordhash");
            entity.Property(e => e.Profilepictureurl).HasColumnName("profilepictureurl");
            entity.Property(e => e.Username)
                .HasMaxLength(256)
                .HasColumnName("username");

            entity.HasMany(d => d.Followers).WithMany(p => p.Followings)
                .UsingEntity<Dictionary<string, object>>(
                    "Follow",
                    r => r.HasOne<User>().WithMany()
                        .HasForeignKey("Followerid")
                        .HasConstraintName("fk_follows_follower"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("Followingid")
                        .HasConstraintName("fk_follows_following"),
                    j =>
                    {
                        j.HasKey("Followerid", "Followingid").HasName("pk_follows");
                        j.ToTable("follows");
                        j.IndexerProperty<string>("Followerid").HasColumnName("followerid");
                        j.IndexerProperty<string>("Followingid").HasColumnName("followingid");
                    });

            entity.HasMany(d => d.Followings).WithMany(p => p.Followers)
                .UsingEntity<Dictionary<string, object>>(
                    "Follow",
                    r => r.HasOne<User>().WithMany()
                        .HasForeignKey("Followingid")
                        .HasConstraintName("fk_follows_following"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("Followerid")
                        .HasConstraintName("fk_follows_follower"),
                    j =>
                    {
                        j.HasKey("Followerid", "Followingid").HasName("pk_follows");
                        j.ToTable("follows");
                        j.IndexerProperty<string>("Followerid").HasColumnName("followerid");
                        j.IndexerProperty<string>("Followingid").HasColumnName("followingid");
                    });

            entity.HasMany(d => d.Posts).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "Like",
                    r => r.HasOne<Post>().WithMany()
                        .HasForeignKey("Postid")
                        .HasConstraintName("fk_likes_posts"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("Userid")
                        .HasConstraintName("fk_likes_users"),
                    j =>
                    {
                        j.HasKey("Userid", "Postid").HasName("pk_likes");
                        j.ToTable("likes");
                        j.IndexerProperty<string>("Userid").HasColumnName("userid");
                        j.IndexerProperty<int>("Postid").HasColumnName("postid");
                    });
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
