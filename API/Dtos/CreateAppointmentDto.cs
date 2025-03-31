using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class CreateAppointmentDto
{
    [Required]
    public string Date { get; set; } = string.Empty;
    public string? ClientName { get; set; } 
}
