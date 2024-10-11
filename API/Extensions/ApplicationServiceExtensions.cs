using System;
using API.Data;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        // Add your service configurations here
        services.AddControllers().AddNewtonsoftJson();
        services.AddDbContext<DataContext>(opt => 
        {
            opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
        services.Configure<BookingSettings>(config.GetSection("BookingSettings"));
        services.AddSignalR();
        

        return services;
    }
}
