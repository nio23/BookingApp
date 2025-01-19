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
        //CreateMap<Appointment, AppointmentDto>().ForMember(dest => dest., opt => opt.MapFrom(src => src.AppUser));
        CreateMap<Appointment, AppointmentDto>();
        CreateMap<RegisterDto, AppUser>().ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName.ToLower()));
        CreateMap<string, DateTime>().ConvertUsing(s=> DateTime.Parse(s, null, DateTimeStyles.AdjustToUniversal));
        CreateMap<DateTime, DateTime>();
        CreateMap<AppUser, MemberDto>();
        CreateMap<Appointment, MyAppointmentDto>().ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.ToString("u")));
        CreateMap<MyAppointmentDto, Appointment>();
        CreateMap<UpdateAppointmentDto, Appointment>();
        
    }
}
