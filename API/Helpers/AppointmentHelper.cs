using System;
using System.Globalization;

namespace API.Helpers;

public static class AppointmentHelper
{
    public static (bool, string) TimeIsValid(DateTime date, int appointmentTime, TimeOnly openTime, TimeOnly closeTime)
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

    public static (bool, string) TimeIsValid(string dateString, int appointmentTime, TimeOnly openTime, TimeOnly closeTime)
    {
        if (!DateTime.TryParse(dateString, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out DateTime date))
        {
            return (false, "Invalid date format");
        }

        return TimeIsValid(date, appointmentTime, openTime, closeTime);
    }
    

}
