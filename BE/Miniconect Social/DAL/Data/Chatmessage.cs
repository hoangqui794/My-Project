using System;
using System.Collections.Generic;

namespace DAL.Data;

public partial class Chatmessage
{
    public int Id { get; set; }

    public string Senderid { get; set; } = null!;

    public string Receiverid { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime Sentat { get; set; }

    public bool Isread { get; set; }

    public virtual User Receiver { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
