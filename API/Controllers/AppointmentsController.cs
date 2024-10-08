using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;
using Microsoft.Extensions.Options;


namespace API.Controllers
{
    //api/appointments
    public class AppointmentsController(IAppointmentRepository appointmentRepository, 
        ILogger<AppointmentsController> logger, IMapper mapper,
        IOptions<BookingSettings> bookingSettings) : BaseApiController
    {
        //Open time and close time are on UTC time
        private readonly BookingSettings BookingSettings = bookingSettings.Value;

        
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
