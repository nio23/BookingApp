using System;

namespace API.Dtos;

public class UserDto
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
}
