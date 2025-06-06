using API.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Runtime.InteropServices.JavaScript;
using System.Diagnostics;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{
    [Authorize(Roles ="Admin")]
    //api/bookingsettings
    public class BookingSettingsController(IOptionsSnapshot<BookingSettings> settings,
         ILogger<BookingSettingsController> logger, IWebHostEnvironment env) : BaseApiController
    {
        //private BookingSettings BookingSettings = settings.Value;

        [HttpGet]
        public ActionResult<BookingSettings> GetBookingSettings()
        {
            return Ok(new {
                AppointmentTime = settings.Value.AppointmentTime,
                CloseTime = settings.Value.CloseTime,
                OpenTime = settings.Value.OpenTime
            });
        }

        [HttpPut]
        public async Task<ActionResult> UpdateBookingSettings(BookingSettings settings)
        {
            if(settings.AppointmentTime <= 5)
                return BadRequest("Appointment time must be greater than 5 minutes");
            
            if(settings.OpenTime >= settings.CloseTime)
                return BadRequest("Open time must be before close time");

            var filePath = GetAppSettingsFilepath();

            JObject jsonObj;
            
            try{
                jsonObj = await FileToJson(filePath);
            }catch(Exception e){
                return BadRequest(e.Message);
            }
            
            var set = jsonObj["BookingSettings"];

            if(set == null){
                logger.LogError("BookingSettings not found in appsettings.json");
                return NotFound();
            }
           
            set["AppointmentTime"] = settings.AppointmentTime;
            set["CloseTime"] = settings.CloseTime.ToString("HH:mm:ss");
            set["OpenTime"] = settings.OpenTime.ToString("HH:mm:ss");
            
            await WriteJsonToFile(filePath, jsonObj);

            return NoContent();
        }

        [HttpPut("open-time")]
        public async Task<ActionResult> UpdateOpenTime([FromBody]JObject payload)
        {
            var openTime = payload["openTime"];

            if(openTime == null)
                return BadRequest("Provide the openTime in the request body");

            TimeOnly timeOnly;
            try{
                timeOnly = TimeOnly.Parse(openTime.ToString());
            }catch(Exception e){
                return BadRequest(e);
            }

            var filePath = GetAppSettingsFilepath();
            
            JObject jsonObj;
            
            try{
                jsonObj = await FileToJson(filePath);
            }catch(Exception e){
                return BadRequest(e.Message);
            }

            var bookingSettings = jsonObj["BookingSettings"];
            if (bookingSettings == null)
            {
                return BadRequest("BookingSettings not found in appsettings.json");
            }

            var closeTimeToken = bookingSettings["CloseTime"];
            if (closeTimeToken == null)
            {
                return BadRequest("CloseTime not found in BookingSettings");
            }
            var closeTime = TimeOnly.Parse(closeTimeToken.ToString());
            
            if(timeOnly >= closeTime)
                return BadRequest("Open time must be before close time");

            
            
            bookingSettings["OpenTime"] = timeOnly.ToString("HH:mm:ss");
            await WriteJsonToFile(filePath, jsonObj);
            return NoContent();
        }

        private string GetAppSettingsFilepath(){
            var fileName = env.IsDevelopment()? "appsettings.Development.json" : "appsettings.json";
            return Path.Combine(Directory.GetCurrentDirectory(), fileName);
        }

        private async Task<JObject> FileToJson(string filePath){
            var text = await System.IO.File.ReadAllTextAsync(filePath);
            try{
                return JObject.Parse(text); 
            }catch(JsonReaderException e){
                logger.LogError(e, $"Error parsing {text}. {e}");
                throw new Exception("Error parsing json file", e);
            }
        }

        private async Task WriteJsonToFile(string filePath, JObject jsonObj){
            string output = JsonConvert.SerializeObject(jsonObj, Formatting.Indented);  
            await System.IO.File.WriteAllTextAsync(filePath, output);
        }
    }
}
