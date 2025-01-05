using System;
using API.Entities;

namespace API.Interfaces;

public interface IAppointmentRepository
{
    Task<IEnumerable<Appointment>> GetAppointmentsAsync();
    Task<IEnumerable<T>> GetAppointmentsAsync<T>(int id);
    Task<IEnumerable<Appointment>> GetAppointmentsByDateAsync(string date);
    void AddAppointment(Appointment appointment);
    void DeleteAppointment(Appointment appointment);
    void UpdateAppointment(Appointment appointment);
    Task<bool> AppointmentExistsAsync(DateTime date);
    Task<bool> AppointmentExistsAsync(string dateString);
    Task<Appointment?> FindAppointmentAsync(int id);
    Task<bool> SaveChangesAsync();
    Task<IEnumerable<Appointment>> GetFreeSlotsAsync(string date);
}
