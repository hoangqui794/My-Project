namespace DAL.IRepository
{
    public interface IChatMessageRepository
    {
        Task<Chatmessage> AddMessageAsync(Chatmessage mes);

        Task<List<Chatmessage>> GetMessageThreadAsync(string userId1, string userId2);

        Task MarkAsReadAsync(int mesId);
    }
}