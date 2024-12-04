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

public class AppointmentsHub(IAppointmentRepository appointmentRepository, IUserRepository userRepository,
 IMapper mapper, IOptions<BookingSettings> bookingSettings) : Hub
{
    //Open time and close time are on UTC time
    private readonly BookingSettings BookingSettings = bookingSettings.Value;

    public async Task SendAppointmentsUpdate(){
        await Clients.All.SendAsync("AppointmentsUpdated");
    }

    public async Task AddAppointment(CreateAppointmentDto createAppointmentDto)
    {
        var user = Context.User;
        if (user == null)
        {
            throw new HubException("User context is null");
        }
        var claims = user.Claims;
        foreach (var claim in claims)
        {
            Console.WriteLine($"Claim Type: {claim.Type}, Claim Value: {claim.Value}");
        }
        var userId = Context.User?.GetUserId();
        
        if (userId == null)
        {
            throw new HubException("User is not valid");
        }

        //var appointment = mapper.Map<Appointment>(appointmentDto);

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

        

        var appUser = await userRepository.GetUserByIdAsync(userId.Value) ?? throw new HubException("User not found");

        var appointment = new Appointment{
            Date = DateTime.Parse(createAppointmentDto.Date),
            AppUser = appUser
        };

        appointmentRepository.AddAppointment(appointment);

        // return new AppointmentDto{
        //     //2009-06-15T13:45:30 -> 2009-06-15 13:45:30Z
        //     Date = appointment.Date.ToString("u"),
        //     ClientName = appointment.ClientName
        // };

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
