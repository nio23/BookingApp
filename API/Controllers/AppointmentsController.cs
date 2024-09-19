using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Dtos;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Controllers
{
    //api/appointments
    public class AppointmentsController(DataContext context, ILogger<AppointmentsController> logger, IMapper mapper) : BaseApiController
    {
        private int appointmentTime = 30;
        private TimeOnly openTime = new TimeOnly(8, 0);
        private TimeOnly closeTime = new TimeOnly(22, 0);
         List<Appointment>_appointments = new List<Appointment>
        {
            new Appointment { Id = 1, Date = new DateTime(2023, 09, 11) },
            new Appointment { Id = 2, Date = new DateTime(2023, 09, 11) },
            new Appointment { Id = 3, Date = new DateTime(2023, 09, 11) }
        };

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            var appointments = await context.Appointments.ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("{date}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDate(string date)
        {
            DateOnly requestDate = DateOnly.Parse(date);
            //logger.LogInformation("DateOnly "+dateOnly);
            var appointments = await context.Appointments
                .Where(x=> DateOnly.FromDateTime(x.Date) == requestDate)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpPost("add")] //api/appointments/add
        public async Task<ActionResult<AppointmentDto>> AddAppointment(AppointmentDto appointmentDto)
        {
            var appointment = mapper.Map<Appointment>(appointmentDto);

            (bool isValid, string errorMsg) timeValidation = TimeIsValid(appointment.Date);

            if(!timeValidation.isValid)
            {
                return BadRequest(timeValidation.errorMsg);
            }

            if (await AppointmentExists(appointment.Date))
            {
                return BadRequest("Appointment already exists");
            }
            context.Appointments.Add(appointment);
            await context.SaveChangesAsync();
            return new AppointmentDto{
                Date = appointment.Date.ToString("s")
            };
        }

        private async Task<bool> AppointmentExists(DateTime date)
        {
            return await context.Appointments.AnyAsync(e => e.Date == date);
        }

        private (bool, string) TimeIsValid(DateTime date)
        {
            var currentDate = DateTime.Now;
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
            
            if(timeOnly <= openTime || timeOnly >= lastAppointmentTime)
            {
                return (false, $"Appointment time must be between {openTime.ToString(cultureInfo)} and {lastAppointmentTime.ToString(cultureInfo)}");
            }

            return (true, string.Empty);
        }

    }
}
