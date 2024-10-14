using System;
using System.Reflection.Metadata.Ecma335;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config){
        services.AddIdentityCore<AppUser>(opt => {
            opt.Password.RequireNonAlphanumeric = false;
    })
        .AddRoles<AppRole>()
        .AddRoleManager<RoleManager<AppRole>>()
        .AddEntityFrameworkStores<DataContext>();

        
        return services;
    }
}
