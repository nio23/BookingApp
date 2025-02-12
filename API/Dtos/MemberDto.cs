using System;

namespace API.Dtos;

public class MemberDto
{
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string Username { get; set; } = string.Empty;
}
