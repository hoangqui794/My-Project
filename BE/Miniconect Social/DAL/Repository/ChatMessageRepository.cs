namespace DAL.Repository
{
    public class ChatMessageRepository : IChatMessageRepository
    {
        private readonly MiniconnectDbContext _context;

        public ChatMessageRepository(MiniconnectDbContext context)
        {
            _context = context;
        }

        public async Task<Chatmessage> AddMessageAsync(Chatmessage mes)
        {
            _context.Chatmessages.Add(mes);
            await _context.SaveChangesAsync();
            return mes;
        }

        public async Task<List<Chatmessage>> GetMessageThreadAsync(string userId1, string userId2)
        {
            return await _context.Chatmessages
                .Where(m => (m.Senderid == userId1 && m.Receiverid == userId2) ||
                            (m.Senderid == userId2 && m.Receiverid == userId1))
                .OrderBy(m => m.Sentat)
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int mesId)
        {
            var message = await _context.Chatmessages.FindAsync(mesId);
            if (message != null && !message.Isread)
            {
                message.Isread = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}