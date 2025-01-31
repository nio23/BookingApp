using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class RegisterDto
{
    [Required]
    public string Username = string.Empty;
    public string Email { get; set; } = string.Empty;
    [Required]
    [MinLength(4)]
    public string Password { get; set; } = string.Empty;
    [Required]
    public string PhoneNumber { get; set; } = string.Empty;
    [Required]
    public string DateOfBirth { get; set; } = string.Empty;
    [Required]
    public string Gender { get; set; } = string.Empty;
}
