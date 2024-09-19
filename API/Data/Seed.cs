using System;
using System.Text.Json;
using API.Entities;
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
}
