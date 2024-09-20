using System;
using System.Globalization;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppointmentRepository(DataContext context) : IAppointmentRepository
{
    public async void AddAppointment(Appointment appointment)
    {
        context.Appointments.Add(appointment);
        await SaveChangesAsync();
    }

    public async void DeleteAppointment(Appointment appointment)
    {
        context.Appointments.Remove(appointment);
        await SaveChangesAsync();
    }

    public async Task<IEnumerable<Appointment>> GetAppointmentsAsync()
    {
        return await context.Appointments.ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(string date)
    {
        DateOnly requestDate = DateOnly.Parse(date);
            var appointments = await context.Appointments
                .Where(x=> DateOnly.FromDateTime(x.Date) == requestDate)
                .OrderBy(x=> x.Date)
                .ToListAsync();
        return appointments;
    }

    public async Task<bool> AppointmentExistsAsync(DateTime date)
    {
        return await context.Appointments.AnyAsync(e => e.Date == date);
    }

    public async Task<Appointment?> FindAppointmentAsync(int id)
    {
        return await context.Appointments.FindAsync(id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void UpdateAppointment(Appointment appointment)
    {
        throw new NotImplementedException();
    }
}
