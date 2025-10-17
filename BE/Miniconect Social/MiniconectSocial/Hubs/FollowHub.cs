

namespace MiniconectSocial.Hubs
{
    public class FollowHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
                await Clients.All.SendAsync("UserConnected", $"{Context.ConnectionId} has conected");
        }


    }
}
