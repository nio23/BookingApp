using System;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{

    public async Task<MemberDto?> GetMemberByUserNameAsync(string username)
    {
        var query = context.Users.Where(x=>x.UserName == username);
        return await query.ProjectTo<MemberDto>(mapper.ConfigurationProvider).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
    }
}
