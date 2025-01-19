using System;

namespace API.Dtos;

public class MyAppointmentDto
{
    public int Id { get; set; }
    public string Date { get; set; } = string.Empty;
    public bool canUpdate { get; set; }
}
