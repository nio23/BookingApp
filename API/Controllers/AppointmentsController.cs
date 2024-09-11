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
    public class AppointmentsController(DataContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            var appointments = await context.Appointments.ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{id}")] //api/appointments/3
        public async Task<ActionResult<Appointment>> GetAppointment(int id) 
        { 
            var appointment = await context.Appointments.FindAsync(id);

            if(appointment == null)
                return NotFound();

            return Ok(appointment);
        }
    }
}
