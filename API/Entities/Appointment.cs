using System;

namespace API.Entities;

public class Appointment
{
    public int Id { get; set; }
    public DateTime Date { get; set; }

    override public string ToString()
    {
        return "Id: "+Id+" Date: "+Date.ToString();
    }
}
