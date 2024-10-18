using System;
using System.ComponentModel.DataAnnotations;
using API.Entities;

namespace API.Dtos;

public class AppointmentDto
{
    [Required]
    public string Date { get; set; } = string.Empty;
    [Required]
    [StringLength(30, MinimumLength = 3)]
    public MemberDto? User { get; set; } 
}
