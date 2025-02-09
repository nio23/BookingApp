using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class UpdateAppointmentDto
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Date { get; set; } = string.Empty;
}
