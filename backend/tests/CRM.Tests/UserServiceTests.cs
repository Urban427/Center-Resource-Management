using Moq;
using Xunit;
using CRM.Services;
using CRM.Domain.Entities;
using CRM.Domain.Enums;
using CRM.Infrastructure.Repositories;
using CRM.Domain.Abstractions;
using Microsoft.Extensions.Configuration;
using CRM.Domain.DTO;

namespace CRM.Tests;

public class UserServiceTests
{
    private UserService CreateService(
        Mock<IUserRepository> users,
        Mock<IRefreshTokenRepository> refresh,
        Mock<IUnitOfWork> uow)
    {
        var config = new Mock<IConfiguration>();
        config.Setup(c => c["Jwt:Key"]).Returns("THIS_IS_A_SUPER_SECRET_KEY_1234567890");

        return new UserService(
            refresh.Object,
            users.Object,
            uow.Object,
            config.Object
        );
    }

    [Fact]
    public async Task RegisterUser_ShouldAddUser_WhenNew()
    {
        var users = new Mock<IUserRepository>();
        var refresh = new Mock<IRefreshTokenRepository>();
        var uow = new Mock<IUnitOfWork>();
        var service = CreateService(users, refresh, uow);
        var user = new User { Id = 0 };
        await service.RegisterUser(user, "admin");
        users.Verify(x => x.AddAsync(user), Times.Once);
        uow.Verify(x => x.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task Authenticate_ShouldReturnNull_WhenUserNotFound()
    {
        var users = new Mock<IUserRepository>();
        users.Setup(x => x.GetByUsername("test")).ReturnsAsync((User?)null);
        var service = CreateService(users, new(), new());
        var result = await service.Authenticate("test");
        Assert.Null(result);
    }

    [Fact]
    public async Task Login_ShouldReturnTokens_WhenUserExists()
    {
        var users = new Mock<IUserRepository>();
        var refreshRepo = new Mock<IRefreshTokenRepository>();
        var uow = new Mock<IUnitOfWork>();
        var user = new User { Id = 1, Name = "john" };
        users.Setup(x => x.GetByUsername("john")).ReturnsAsync(user);
        var service = CreateService(users, refreshRepo, uow);
        var result = await service.Login(new LoginDto { Username = "john" });
        Assert.NotNull(result);
        refreshRepo.Verify(x => x.AddAsync(It.IsAny<RefreshToken>()), Times.Once);
        uow.Verify(x => x.SaveChangesAsync(), Times.Once);
    }
}
