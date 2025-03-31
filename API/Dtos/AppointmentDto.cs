using System;
using System.ComponentModel.DataAnnotations;
using API.Entities;
using Newtonsoft.Json;

namespace API.Dtos;

public class AppointmentDto
{
    public int? Id { get; set; }
    [Required]
    public string Date { get; set; } = string.Empty;
    public MemberDto? User { get; set; }
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public string? ClientName { get; set; }

     
}
