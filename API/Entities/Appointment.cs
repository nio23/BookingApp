using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Appointments")]
public class Appointment
{
    public int Id { get; set; }
    public required DateTime Date { get; set; } 
    public string? ClientName { get; set; }

    //Ef navigation properties
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;
}
