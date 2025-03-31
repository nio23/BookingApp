using System;
using Newtonsoft.Json;

namespace API.Dtos;

public class MyAppointmentDto
{
    public int Id { get; set; }
    public string Date { get; set; } = string.Empty;
    public bool CanUpdateOrDelete { get; set; }
    
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string? ClientName { get; set; }
}
