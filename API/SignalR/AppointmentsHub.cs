using System;
using System.Globalization;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.Helpers;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using API.Extensions;

namespace API.SignalR;

public class AppointmentsHub(IAppointmentRepository appointmentRepository, IMapper mapper, IOptions<BookingSettings> bookingSettings) : Hub
{
    //Open time and close time are on UTC time
    private readonly BookingSettings BookingSettings = bookingSettings.Value;

    public async Task SendAppointmentsUpdate(){
        await Clients.All.SendAsync("AppointmentsUpdated");
    }

    public async Task AddAppointment(CreateAppointmentDto createAppointmentDto)
    {
        var user = Context.User ?? throw new HubException("User context is null");

        var userId = user.GetUserId();
        
        (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(createAppointmentDto.Date, 
            BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

        if(!isValid)
        {
            throw new HubException(errorMsg);
        }

        if(await appointmentRepository.AppointmentExistsAsync(createAppointmentDto.Date))
        {
            throw new HubException("There is already an appointment at this time");
        }

        var appointment = new Appointment{
            Date = DateTime.Parse(createAppointmentDto.Date),
            AppUserId = userId
        };

        appointmentRepository.AddAppointment(appointment);

        if(!await appointmentRepository.SaveChangesAsync())
        {
            throw new HubException("Failed to book the appointment");
        }

        await Clients.All.SendAsync("NewAppointment", mapper.Map<AppointmentDto>(appointment));
    }

    public async Task DeleteAppointment(int id)
    {
        var appointment = await appointmentRepository.FindAppointmentAsync(id);
        if (appointment == null)
        {
            throw new HubException("Appointment not found");
        }

        appointmentRepository.DeleteAppointment(appointment);    

        await Clients.All.SendAsync("AppointmentDeleted", id);
    }

   
}
