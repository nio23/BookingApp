using System;
using API.Entities;

namespace API.Interfaces;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetAppointmentsAsync();
    Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(string date);
    void AddAppointment(Appointment appointment);
    void DeleteAppointment(Appointment appointment);
    void UpdateAppointment(Appointment appointment);
    Task<bool> AppointmentExistsAsync(DateTime date);
    Task<Appointment?> FindAppointmentAsync(int id);
    Task<bool> SaveChangesAsync();
}
