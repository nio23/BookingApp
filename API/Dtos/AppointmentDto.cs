using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class AppointmentDto
{
    [Required]public string? Date { get; set; }
    public string? ClientName { get; set; }
}
