using System;
using System.Text.Json;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedAppointments(DataContext context)
    {
        if (await context.Appointments.AnyAsync()) return;
        
        var appointmentData = await File.ReadAllTextAsync("Data/AppointmentSeedData.json");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var appointments = JsonSerializer.Deserialize<List<Appointment>>(appointmentData, options);

        if (appointments == null) return;
        
        // var appointments = new List<Appointment>
        // {
        //     new Appointment { Date = new DateTime(2023, 09, 11) },
        //     new Appointment { Date = new DateTime(2023, 09, 11) },
        //     new Appointment { Date = new DateTime(2023, 09, 11) }
        // };

        await context.Appointments.AddRangeAsync(appointments);
        await context.SaveChangesAsync();
    }

    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, ILogger logger){
        if(await userManager.Users.AnyAsync()) 
            return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        if(users == null) 
            return;
        
        var roles = new List<AppRole>{
            new() {Name = "Member"},
            new() {Name = "Admin"},
            new() {Name = "Moderator"},
            
        };

        foreach(var role in roles){
            await roleManager.CreateAsync(role);
        }

        foreach(var user in users){
            user.UserName = user.UserName!.ToLower();
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        var admin = new AppUser{UserName = "admin", Gender = "male", DateOfBirth = new DateOnly(1999, 09, 11)};

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
