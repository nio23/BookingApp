using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Controllers
{
    //api/appointments
    public class AppointmentsController(IAppointmentRepository appointmentRepository, ILogger<AppointmentsController> logger, IMapper mapper) : BaseApiController
    {
        private int appointmentTime = 30;
        //Open time is 5:00 AM UTC
        //Close time is 7:00 PM UTC
        private TimeOnly openTime = new TimeOnly(5, 0);
        private TimeOnly closeTime = new TimeOnly(19, 0);

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            var appointments = await appointmentRepository.GetAppointmentsAsync();
            return Ok(appointments);
        }

        [HttpGet("{date}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDate(string date)
        {
            var appointments = await appointmentRepository.GetAppointmentsByDateAsync(date);

            if(appointments.Count() == 0)
            {
                return NotFound();
            }

            return Ok(appointments);
        }

        [HttpPost("add")] //api/appointments/add
        public async Task<ActionResult<AppointmentDto>> AddAppointment([FromBody]AppointmentDto appointmentDto)
        {
            var appointment = mapper.Map<Appointment>(appointmentDto);

            (bool isValid, string errorMsg) = TimeIsValid(appointment.Date);

            if(!isValid)
            {
                return BadRequest(errorMsg);
            }

            if(await appointmentRepository.AppointmentExistsAsync(appointment.Date))
            {
                return BadRequest("You already have an appointment at this time");
            }

            appointmentRepository.AddAppointment(appointment);

            return new AppointmentDto{
                //2009-06-15T13:45:30 -> 2009-06-15 13:45:30Z
                Date = appointment.Date.ToString("u"),
                ClientName = appointment.ClientName
            };
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            var appointment = await appointmentRepository.FindAppointmentAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            appointmentRepository.DeleteAppointment(appointment);    

            return Ok();
        }

        [HttpPut("{id}")]//api/appointments/{id}
        public async Task<ActionResult> UpdateAppointment(int id, AppointmentDto updateAppointmentDto)
        {
            var appointment = await appointmentRepository.FindAppointmentAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            if(await appointmentRepository.AppointmentExistsAsync(appointment.Date))
            {
                return BadRequest("You already have an appointment at this time");
            }

            mapper.Map(updateAppointmentDto, appointment);

            (bool isValid, string errorMsg) = TimeIsValid(appointment.Date);

            if(!isValid)
            {
                return BadRequest(errorMsg);
            }

            

            await appointmentRepository.SaveChangesAsync();

            return Ok();
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
}
