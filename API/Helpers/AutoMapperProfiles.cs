using System;
using API.Dtos;
using API.Entities;
using AutoMapper;
using System.Globalization;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppointmentDto, Appointment>();
        CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s, null, DateTimeStyles.AdjustToUniversal));
        //CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s));
    }
}
