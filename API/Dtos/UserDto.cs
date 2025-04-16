using System;

namespace API.Dtos;

public class UserDto
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public required string Token { get; set; }
}
