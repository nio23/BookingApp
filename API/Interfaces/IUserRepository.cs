using System;
using API.Dtos;
using API.Entities;

namespace API.Interfaces;

public interface IUserRepository
{
    Task<MemberDto?> GetMemberByUserNameAsync(string id);
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<AppUser?> GetUserByIdAsync(int userId);
}
