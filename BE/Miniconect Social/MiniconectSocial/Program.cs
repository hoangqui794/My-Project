var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MiniconnectDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    );

// Đăng ký repository và service
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();

// THÊM DÒNG NÀY VÀO ĐÂY
builder.Services.AddMemoryCache();
builder.Services.AddSignalR();

var jwtConfig = builder.Configuration.GetSection("Jwt");
string issuer = jwtConfig["Issuer"];
string audience = jwtConfig["Audience"];
string secretKey = jwtConfig["SecretKey"];

builder.Services.AddAuthentication( options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

//CORS
var myCorsPolicy = "MyCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myCorsPolicy,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                      });
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // Cấu hình thông tin cơ bản cho API (tùy chọn nhưng nên có)
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "MiniconectSocial API", Version = "v1" });

    // === PHẦN QUAN TRỌNG BẮT ĐẦU TỪ ĐÂY ===
    // 1. Định nghĩa cơ chế bảo mật (Security Definition)
    // Ta nói cho Swagger biết: "API của tôi dùng xác thực Bearer (JWT)."
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Vui lòng nhập token vào đây. Ví dụ: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.Http, // Dùng ApiKey vì Bearer là một dạng của nó
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    // 2. Áp dụng yêu cầu bảo mật (Security Requirement)
    // Ta nói cho Swagger biết: "Hãy thêm ổ khóa vào các endpoint và sử dụng cơ chế 'Bearer' đã định nghĩa ở trên."
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // ID này phải khớp với tên đã định nghĩa ở trên
                }
            },
            new string[] {}
        }
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();



// Redirect về trang Swagger khi truy cập "/"
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.UseHttpsRedirection();
// BƯỚC 2: SỬ DỤNG MIDDLEWARE CORS
app.UseCors(myCorsPolicy);
app.UseAuthentication();
app.UseMiddleware<MiniconectSocial.Middlewares.TokenBlacklistMiddleware>();

app.UseAuthorization();

app.MapControllers();
app.MapHub<MiniconectSocial.Hubs.FollowHub>("/hubs/followHub");
app.MapHub<MiniconectSocial.Hubs.UserHub>("/hubs/userHub");

app.Run();
