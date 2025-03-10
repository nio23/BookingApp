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
        
        var parsedDate = mapper.Map<DateTime>(createAppointmentDto.Date);

        (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(parsedDate, 
            BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

        if(!isValid)
        {
            throw new HubException(errorMsg);
        }

        if(await appointmentRepository.AppointmentExistsAsync(parsedDate))
        {
            throw new HubException("There is already an appointment at this time");
        }

        var appointment = new Appointment{
            Date = parsedDate,
            AppUserId = userId
        };

        appointmentRepository.AddAppointment(appointment);

        if(!await appointmentRepository.SaveChangesAsync())
        {
            throw new HubException("Failed to book the appointment");
        }

        var result = mapper.Map<MyAppointmentDto>(appointment);
        result.CanUpdateOrDelete = AppointmentHelper.CanUpdateOrDelete(appointment.Date);

        await Clients.All.SendAsync("NewAppointment", result);
    }

    public async Task DeleteAppointment(int id)
    {
        var user = Context.User ?? throw new HubException("User context is null");

        var userId = user.GetUserId();

        var appointment = await appointmentRepository.FindAppointmentAsync(id) ?? throw new HubException("Appointment not found");

        if(appointment.AppUserId != userId)
        {
            throw new HubException("You are not authorized to delete this appointment");
        }

        if(!AppointmentHelper.CanUpdateOrDelete(appointment.Date))
        {
            throw new HubException("You can't cancel an appointment in the past or within 10 minutes of the appointment time");
        }

        appointmentRepository.DeleteAppointment(appointment);

        if(!await appointmentRepository.SaveChangesAsync())
        {
            throw new HubException("Failed to cancel the appointment");
        }    

        await Clients.All.SendAsync("AppointmentDeleted");
    }

   
}
