using System;
using System.Globalization;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class AppointmentsHub(IAppointmentRepository appointmentRepository, IMapper mapper) : Hub
{
    private int appointmentTime = 30;
    //Open time is 5:00 AM UTC
    //Close time is 7:00 PM UTC
    private TimeOnly openTime = new TimeOnly(5, 0);
    private TimeOnly closeTime = new TimeOnly(19, 0);

    public async Task SendAppointmentsUpdate(){
        await Clients.All.SendAsync("AppointmentsUpdated");
    }

    public async Task AddAppointment(AppointmentDto appointmentDto){
        var appointment = mapper.Map<Appointment>(appointmentDto);

            (bool isValid, string errorMsg) = TimeIsValid(appointment.Date);

            if(!isValid)
            {
                throw new HubException(errorMsg);
            }

            if(await appointmentRepository.AppointmentExistsAsync(appointment.Date))
            {
                throw new HubException("You already have an appointment at this time");
            }

            appointmentRepository.AddAppointment(appointment);

            // return new AppointmentDto{
            //     //2009-06-15T13:45:30 -> 2009-06-15 13:45:30Z
            //     Date = appointment.Date.ToString("u"),
            //     ClientName = appointment.ClientName
            // };

        await Clients.All.SendAsync("NewAppointment", mapper.Map<Appointment>(appointmentDto));
    }

    private (bool, string) TimeIsValid(DateTime date)
    {
        if(date.Kind != DateTimeKind.Utc)
        {
            return (false, "Date must be in UTC format");
        }

        var currentDate = DateTime.UtcNow;
        if(date < currentDate)
        {
            return (false, "Cannot book an appointment in the past");
        }

        if(date.Minute % appointmentTime != 0)
        {
            return (false, $"Appointment time must be in {appointmentTime} minute intervals");
        }

        var timeOnly = TimeOnly.FromDateTime(date);

        var lastAppointmentTime = closeTime.AddMinutes(-appointmentTime);
        var cultureInfo = CultureInfo.GetCultureInfo("en-US");
        
        if(timeOnly < openTime || timeOnly > lastAppointmentTime)
        {
            return (false, $"Appointment must be between {openTime.ToString(cultureInfo)} - {lastAppointmentTime.ToString(cultureInfo)} UTC time");
        }

        return (true, string.Empty);
    }
}
