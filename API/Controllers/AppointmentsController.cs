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
using API.Extensions;
using Microsoft.AspNetCore.Identity;


namespace API.Controllers
{
    //api/appointments
    [Authorize]
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

        [Authorize(Roles ="Admin, Moderator, Member")]
        [HttpGet("free/{date}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetFreeSlots(string date){
            var selectedDate = DateTime.Parse(date);

            if(selectedDate < DateTime.Today)
            {
                return BadRequest("You can't request a date in the past");
            }

            var appointments = await appointmentRepository.GetAppointmentsByDateAsync(date);
            var firstAppointment = bookingSettings.Value.OpenTime;
            var lastAppointment = bookingSettings.Value.CloseTime;
            var appointmentTime = Convert.ToDouble(bookingSettings.Value.AppointmentTime);
            var freeSlots = new List<Slot>();

            
            var currentAppointment = TimeOnly.FromDateTime(selectedDate);
            currentAppointment = currentAppointment.AddHours(firstAppointment.Hour);
            currentAppointment = currentAppointment.AddMinutes(firstAppointment.Minute);

            //Create a list of free slots
            while(currentAppointment < lastAppointment)
            {
                //If there is no appointment at this time, add it to the list
                if(!appointments.Any(a => TimeOnly.FromDateTime(a.Date) == currentAppointment))
                {
                    var dt = new DateTime(selectedDate.Year, selectedDate.Month, selectedDate.Day, currentAppointment.Hour, currentAppointment.Minute, 0, DateTimeKind.Utc);
                    freeSlots.Add(new Slot{
                        Date = dt
                    });
                }
                currentAppointment = currentAppointment.AddMinutes(appointmentTime);
            }

            if(!freeSlots.Any())
                return NotFound("There are no free slots for this date");
            return Ok(freeSlots);
        }

        
        [Authorize(Roles ="Admin, Moderator")]
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
        
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<MyAppointmentDto>>> GetMyAppointments()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("You are not authorized to view this page");
                }

            var appointments = await appointmentRepository.GetAppointmentsAsync<MyAppointmentDto>(int.Parse(userId));

            return Ok(appointments);
        }

        [HttpPost("new")] //api/appointments/new
        public async Task<ActionResult> AddAppointment([FromBody]CreateAppointmentDto createAppointmentDto)
        {
            var user = User.GetUserId();

            var parsedDate = mapper.Map<DateTime>(createAppointmentDto.Date);

            (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(parsedDate, 
                BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

            if(!isValid)
            {
                return BadRequest(errorMsg);
            }

            if(await appointmentRepository.AppointmentExistsAsync(parsedDate))
            {
                return BadRequest("There is an other appointment at this time");
            }

            var appointment = new Appointment{
                Date = parsedDate,
                AppUserId = user
            };

            appointmentRepository.AddAppointment(appointment);

            if(!await appointmentRepository.SaveChangesAsync())
            {
                return BadRequest("Failed to book the appointment");
            }

            var result = new {
                //2009-06-15T13:45:30 -> 2009-06-15 13:45:30Z
                Date = appointment.Date.ToString("u")
            };

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(int id)
        {
            var userId = User.GetUserId();

            var appointment = await appointmentRepository.FindAppointmentAsync(id);

            if (appointment == null)
            {
                return NotFound();
            }

            if(appointment.AppUserId != userId)
            {
                return Unauthorized("You are not authorized to delete this appointment");
            }

            appointmentRepository.DeleteAppointment(appointment);    
            if(!await appointmentRepository.SaveChangesAsync())
            {
                return BadRequest("Failed to delete the appointment");
            }
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
