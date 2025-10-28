namespace MiniconectSocial.Controllers.Chat
{
    [Route("api/v1/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatMessageService _chatService;
        private readonly IHubContext<ChatHubs> _hubContext;

        public ChatController(IChatMessageService chatService, IHubContext<ChatHubs> hubContext)
        {
            _chatService = chatService;
            _hubContext = hubContext;
        }

        // POST api/<ChatController>
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            var senderId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized("Khoong tìm thấy người gửi!!!!!!");
            }

            var mes = await _chatService.SendMessageAsync(senderId, dto.ReceiverId, dto.Content);

            // Gửi tin nhắn qua SignalR
            await _hubContext.Clients.Users(new[] { senderId, dto.ReceiverId })
                .SendAsync("ReceiveMessage", new
                {
                    SenderId = senderId,
                    ReceiverId = dto.ReceiverId,
                    Content = dto.Content,
                    SentAt = mes.Sentat
                });
            return Ok(mes);
        }

        //Lấy lịch sưr chat
        [HttpGet("thread")]
        public async Task<IActionResult> GetMessageThread([FromQuery] string userId)
        {
            var myId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(myId))
            {
                return Unauthorized("Không tìm thấy người dùng");
            }
            var messages = await _chatService.GetMessageThreadAsync(myId, userId);
            return Ok(messages);
        }

        // Đânhs dấu tin nhắn đã đọc
        [HttpPost("read/{messageId}")]
        public async Task<IActionResult> MarkAsRead(int messageId)
        {
            await _chatService.MarkAsReadAsync(messageId);
            return Ok();
        }
    }
}