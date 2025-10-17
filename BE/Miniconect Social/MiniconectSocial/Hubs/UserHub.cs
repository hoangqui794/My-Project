using System.Runtime.CompilerServices;

namespace MiniconectSocial.Hubs
{
    public class UserHub:Hub
    {
        //public override async Task OnConnectedAsync()
        //{
        //        await Clients.All.SendAsync("UserConnected", $"{Context.ConnectionId} has conected");
        //}

        public Task Register(string userId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }

        public Task Unregister(string userId) {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
    }
}
