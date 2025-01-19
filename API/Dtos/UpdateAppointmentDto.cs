using System;

namespace API.Dtos;

public class UpdateAppointmentDto
{
    public int Id { get; set; }
    public required string Date { get; set; } 
}
