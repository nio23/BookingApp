using System;

namespace API.Entities;

public class Appointment
{
    public int Id { get; set; }
    public required DateTime Date { get; set; } 
    public required string ClientName {get; set; } = string.Empty;
}
