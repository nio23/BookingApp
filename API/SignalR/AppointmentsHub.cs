using System;
using System.Globalization;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.Helpers;
using Microsoft.Extensions.Options;

namespace API.SignalR;

public class AppointmentsHub(IAppointmentRepository appointmentRepository, IMapper mapper, IOptions<BookingSettings> bookingSettings) : Hub
{
    //Open time and close time are on UTC time
    private readonly BookingSettings BookingSettings = bookingSettings.Value;

    public async Task SendAppointmentsUpdate(){
        await Clients.All.SendAsync("AppointmentsUpdated");
    }

    public async Task AddAppointment(AppointmentDto appointmentDto)
    {
        var appointment = mapper.Map<Appointment>(appointmentDto);

        (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(appointment.Date, 
            BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

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

   
}
