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

        [AllowAnonymous]
        [HttpGet("free/{date}")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetFreeSlots(string date){
            var selectedDate = mapper.Map<DateTime>(date);

            if(selectedDate.Date < DateTime.UtcNow.Date)
            {
                return BadRequest("You can't request a date in the past");
            }



            var appointments = await appointmentRepository.GetAppointmentsByDateAsync(date);
            var firstSlot = bookingSettings.Value.OpenTime;
            var lastSlot = bookingSettings.Value.CloseTime;
            var appointmentTime = Convert.ToDouble(bookingSettings.Value.AppointmentTime);
            var freeSlots = new List<Slot>();

            if(selectedDate.Date == DateTime.UtcNow.Date){
                var currentTime = TimeOnly.FromDateTime(DateTime.UtcNow);
                firstSlot = currentTime.Minute % appointmentTime == 0 ? currentTime : currentTime.AddMinutes(appointmentTime - (currentTime.Minute % appointmentTime));
            }

            var currentSlot = firstSlot;

            //Create a list of free slots
            while(currentSlot < lastSlot)
            {
                //If there is no appointment at this time, add it to the list
                if(!appointments.Any(a => TimeOnly.FromDateTime(a.Date) == currentSlot))
                {
                    var dt = new DateTime(selectedDate.Year, selectedDate.Month, selectedDate.Day, currentSlot.Hour, currentSlot.Minute, 0, DateTimeKind.Utc);
                    freeSlots.Add(new Slot{
                        Date = dt
                    });
                }
                currentSlot = currentSlot.AddMinutes(appointmentTime);
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
            var userId = User.GetUserId();
            
            var appointments = await appointmentRepository.GetAppointmentsAsync<MyAppointmentDto>(userId);
            
            var result = appointments.Select(a => {
                var appointmentDate = mapper.Map<string, DateTime>(a.Date);
                a.CanUpdateOrDelete = AppointmentHelper.CanUpdateOrDelete(appointmentDate);  
                return a;
            });

            return Ok(result);
        }

        [HttpPost("new")] //api/appointments/new
        public async Task<ActionResult> AddAppointment([FromBody]CreateAppointmentDto createAppointmentDto)
        {
            var user = User.GetUserId();

            var parsedDate = mapper.Map<DateTime>(createAppointmentDto.Date);
            //logger.LogInformation($"Parsed date: {parsedDate}");

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
                Date = appointment.Date
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

            if(AppointmentHelper.CanUpdateOrDelete(appointment.Date))
            {
                return BadRequest("You can't cancel an appointment in the past or within 10 minutes of the appointment time");
            }

            appointmentRepository.DeleteAppointment(appointment);    
            if(!await appointmentRepository.SaveChangesAsync())
            {
                return BadRequest("Failed to cancel the appointment");
            }
            return Ok();
        }

        [HttpPut()]//api/appointments/
        public async Task<ActionResult> UpdateAppointment(UpdateAppointmentDto updateAppointmentDto)
        {
            var userId = User.GetUserId();

            var appointment = await appointmentRepository.FindAppointmentAsync(updateAppointmentDto.Id);

            if (appointment == null)
            {
                return NotFound();
            }

            if(appointment.AppUserId != userId)
            {
                return Unauthorized("You are not authorized to update this appointment");
            }

            (bool isValid, string errorMsg) = AppointmentHelper.TimeIsValid(updateAppointmentDto.Date, 
                BookingSettings.AppointmentTime, BookingSettings.OpenTime, BookingSettings.CloseTime);

            if(!isValid)
            {
                return BadRequest(errorMsg);
            }   

            if(await appointmentRepository.AppointmentExistsAsync(updateAppointmentDto.Date))
            {
                return BadRequest("There is already an appointment at this time");
            }

            if(!AppointmentHelper.CanUpdateOrDelete(appointment.Date))
            {
                return BadRequest("You can't update an appointment in the past or within 10 minutes of the appointment time");
            }
            // if(!AppointmentHelper.CanUpdateOrDelete(appointment.Date))
            // {
            //     return BadRequest("You can only update your appointment at least 15 minutes before the appointment");
            // }

            mapper.Map(updateAppointmentDto, appointment); 

            await appointmentRepository.SaveChangesAsync();

            return Ok();
        }



    }
}
