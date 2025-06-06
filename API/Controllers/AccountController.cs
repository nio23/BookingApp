using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await UserExists(registerDto.Username)) 
                return BadRequest("Username is taken");
            
            var user = mapper.Map<AppUser>(registerDto);

            // if(user.UserName == null || user.Email == null)
            //     return BadRequest("Username or Email is null");  

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) 
                return BadRequest(result.Errors);

            return new UserDto{
                Username = user.UserName!,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!,
                Token = await tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user = await userManager.FindByNameAsync(loginDto.UserName.ToLower());

            if(user == null || user.UserName == null)
                return Unauthorized("Invalid username");
            
            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result)
                return Unauthorized();
                
            return new UserDto{
                Username = user.UserName,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber!,
                Token = await tokenService.CreateToken(user)
            };
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<UserDto>> GoogleLogin(SocialUserDto socialUserDto){

            
            var user = await userManager.FindByEmailAsync(socialUserDto.Email);

            if(user == null){
                var username = socialUserDto.Name.ToLower().Replace(" ", "");
                string uniqueUsername = username;

                while(await UserExists(uniqueUsername)){
                    uniqueUsername = $"{username}{Guid.NewGuid().ToString().Substring(0, 4)}";
                }

                user = new AppUser{
                    UserName = uniqueUsername,
                    Email = socialUserDto.Email
                };

                var result = await userManager.CreateAsync(user);

                if (!result.Succeeded)
                    return BadRequest(result.Errors);
                   
            }

            return new UserDto{
                Username = user.UserName!,
                Email = user.Email!,
                Token = await tokenService.CreateToken(user)
            };
        }

    

        //Normalized is uppercase
        //ToM != tom
        private async Task<bool> UserExists(string username){     
            return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
        }

    }
}
