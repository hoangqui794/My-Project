namespace MiniconectSocial.Hubs
{
    public class ChatHubs : Hub
    {
        public async Task sendMessage(string reciverId, string content)
        {
            var senderId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderId))
            {
                return;
            }
            // Gửi tin nhắn đến cả người gửi và người nhận
            await Clients.Users(new[] { senderId, reciverId })

                .SendAsync("ReceiveMessage", new
                {
                    SenderId = senderId,
                    ReceiverId = reciverId,
                    Content = content,
                    SendAt = DateTime.UtcNow
                });
        }

        public async Task MarkAsRead(string senderId, int messageId)
        {
            var receiverId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(receiverId)) return;

            await Clients.User(senderId)
                .SendAsync("MessageRead", new
                {
                    MessageId = messageId,
                    ReaderId = receiverId,
                    ReadAt = DateTime.UtcNow
                });
        }
    }
}