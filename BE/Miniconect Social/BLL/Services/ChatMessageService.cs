using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IChatMessageRepository _chatMessageRepository;

        public ChatMessageService(IChatMessageRepository chatMessageRepository)
        {
            _chatMessageRepository = chatMessageRepository;
        }

        public async Task<List<Chatmessage>> GetMessageThreadAsync(string userId1, string userId2)
        {
            var messages = await _chatMessageRepository.GetMessageThreadAsync(userId1, userId2);
            return messages;
        }

        public async Task MarkAsReadAsync(int mesId)
        {
            await _chatMessageRepository.MarkAsReadAsync(mesId);
        }

        public Task<Chatmessage> SendMessageAsync(string senderId, string receiverId, string content)
        {
            var message = new Chatmessage
            {
                Senderid = senderId,
                Receiverid = receiverId,
                Content = content,
                Sentat = DateTime.UtcNow,
                Isread = false
            };
            return _chatMessageRepository.AddMessageAsync(message);
        }
    }
}