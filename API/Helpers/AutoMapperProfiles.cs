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
        CreateMap<RegisterDto, AppUser>().ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName.ToLower()));
        CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s, null, DateTimeStyles.AdjustToUniversal));
        //CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s));
    }
}
