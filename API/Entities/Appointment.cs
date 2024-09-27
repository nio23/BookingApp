using System;

namespace API.Entities;

public class Appointment
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string ClientName {get; set; } = string.Empty;
}
