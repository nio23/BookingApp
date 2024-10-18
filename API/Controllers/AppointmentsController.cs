using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using AutoMapper.Configuration.Annotations;
using System.Security.Claims;


namespace API.Controllers
{
    //api/appointments
    public class AppointmentsController(IAppointmentRepository appointmentRepository, 
        ILogger<AppointmentsController> logger, IMapper mapper,
        IOptionsSnapshot<BookingSettings> bookingSettings) : BaseApiController
    {
        //Open time and close time are on UTC time
        private readonly BookingSettings BookingSettings = bookingSettings.Value;

        //[Authorize(Roles ="Admin, Moderator")]
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        // {
        //     var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
        //     if (string.IsNullOrEmpty(userId))
        //         {
        //             return Unauthorized("User ID not found in claims");
        //         }

        //     var appointments = await appointmentRepository.GetAppointmentsAsync(int.Parse(userId));
        //     return Ok(appointments);
        // }

        [HttpGet("free/{date}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetFreeSlots(string date){
            var currentDate = DateTime.Parse(date);

            if(currentDate < DateTime.Today)
            {
                return BadRequest("You can't request a date in the past");
            }

            var appointments = await appointmentRepository.GetAppointmentsByDateAsync(date);
            var firstAppointment = bookingSettings.Value.OpenTime;
            var lastAppointment = bookingSettings.Value.CloseTime;
            var appointmentTime = bookingSettings.Value.AppointmentTime;
            var freeSlots = new List<Appointment>();

            
            var currentAppointment = TimeOnly.FromDateTime(currentDate);
            currentAppointment = currentAppointment.AddHours(firstAppointment.Hour);
            currentAppointment = currentAppointment.AddMinutes(firstAppointment.Minute);
    
            logger.LogInformation($"Current date: {currentAppointment}");


            while(currentAppointment < lastAppointment)
            {
                if(!appointments.Any(a => TimeOnly.FromDateTime(a.Date) == currentAppointment))
                {
                    var dt = new DateTime(currentDate.Year, currentDate.Month, currentDate.Day);
                    dt = dt.AddHours(currentAppointment.Hour);
                    dt = dt.AddMinutes(currentAppointment.Minute);
                    freeSlots.Add(new Appointment{
                        Date = DateTime.SpecifyKind(dt, DateTimeKind.Utc)
                    });
                    currentAppointment = currentAppointment.AddMinutes(appointmentTime);

                }
            }

            if(!freeSlots.Any())
                return NotFound("There are no free slots for this date");
            return Ok(freeSlots);
        }

        
        //[Authorize(Roles ="Admin, Moderator")]
        [HttpGet("{date}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentsByDate(string date)
        {
            var appointments = await appointmentRepository.GetAppointmentsByDateAsync(date);

            if(appointments.Count() == 0)
            {
                return NotFound();
            }

            var appointmentsToReturn = mapper.Map<IEnumerable<AppointmentDto>>(appointments);

            return Ok(appointmentsToReturn);
        }

        [HttpPost("add")] //api/appointments/add
        public async Task<ActionResult<AppointmentDto>> AddAppointment([FromBody]AppointmentDto appointmentDto)
        {
            var appointment = mapper.Map<Appointment>(appointmentDto);

            (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(appointment.Date, 
                BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

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
                Date = appointment.Date.ToString("u")
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

            (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(appointment.Date, 
                BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

            if(!isValid)
            {
                return BadRequest(errorMsg);
            }         

            await appointmentRepository.SaveChangesAsync();

            return Ok();
        }



    }
}
