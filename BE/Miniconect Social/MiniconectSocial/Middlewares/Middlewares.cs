using BLL.IService;
using Microsoft.AspNetCore.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MiniconectSocial.Middlewares
{
    public class TokenBlacklistMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenBlacklistMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUserService userService)
        {
            // Chỉ kiểm tra nếu người dùng đã được xác thực (có token hợp lệ)
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var jti = context.User.FindFirstValue(JwtRegisteredClaimNames.Jti);

                // Nếu token có Jti và Jti đó nằm trong blacklist
                if (jti != null && await userService.IsTokenBlacklistedAsync(jti))
                {
                    // Chặn request và trả về lỗi 401 Unauthorized
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Token has been revoked.");
                    return; // Dừng xử lý request tại đây
                }
            }

            // Nếu token hợp lệ, cho request đi tiếp
            await _next(context);
        }
    }
}