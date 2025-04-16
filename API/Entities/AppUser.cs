using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser: IdentityUser<int>
{
    public string Gender { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<Appointment> Appointments { get; set; } = [];
}
