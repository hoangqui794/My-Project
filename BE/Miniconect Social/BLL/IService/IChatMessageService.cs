using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.IService
{
    public interface IChatMessageService
    {
        Task<Chatmessage> SendMessageAsync(string senderId, string receiverId, string content);

        Task<List<Chatmessage>> GetMessageThreadAsync(string userId1, string userId2);

        Task MarkAsReadAsync(int mesId);
    }
}