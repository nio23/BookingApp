using System.Security.Cryptography.X509Certificates;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")] //api/appointments
    [ApiController]
    public class AppointmentsController(DataContext context, ILogger<AppointmentsController> logger) : ControllerBase
    {
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
            appointments.ForEach(app => logger.LogInformation("Appointment "+app.ToString()));
            return Ok(appointments);
        }

        // [HttpGet("{id}")] //api/appointments/3
        // public async Task<ActionResult<Appointment>> GetAppointment(int id) 
        // { 
        //     var appointment = await context.Appointments.FindAsync(id);

        //     if(appointment == null)
        //         return NotFound();

        //     return Ok(appointment);
        // }

        [HttpGet("{date}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDate(string date)
        {
            DateOnly requestDate = DateOnly.Parse(date);
            //logger.LogInformation("DateOnly "+dateOnly);
            var appointments = await context.Appointments
                .Where(x=> DateOnly.FromDateTime(x.Date) == requestDate)
                .ToListAsync();
                
            //appointments.ForEach(app => logger.LogInformation("Appointment "+ DateOnly.FromDateTime(app.Date)));

            //logger.LogInformation("Appointments "+date.ToString());
            return Ok(appointments);
        }

    }
}
