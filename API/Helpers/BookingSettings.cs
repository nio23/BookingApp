using System;

namespace API.Helpers;

public class BookingSettings
{
    public int AppointmentTime { get; set; }
    public TimeOnly CloseTime { get; set; }
    public TimeOnly OpenTime { get; set; }
}
