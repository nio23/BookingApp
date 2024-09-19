using System;
using API.Dtos;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppointmentDto, Appointment>();
        CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s));
    }
}
