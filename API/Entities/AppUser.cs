using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser: IdentityUser<int>
{
    public required string Gender { get; set; }
    public required DateOnly DateOfBirth { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<Appointment> Appointments { get; set; } = [];
}
