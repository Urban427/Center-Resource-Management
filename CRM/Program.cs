using CRM.Services;
using CRM.Infrastructure.Persistence;
using CRM.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add repositories
builder.Services.AddScoped<BookingRepository>();
builder.Services.AddScoped<DeviceRepository>();
builder.Services.AddScoped<DeviceStatusHistoryRepository>();
builder.Services.AddScoped<DeviceTypeRepository>();
builder.Services.AddScoped<EntityChangeSetRepository>();
builder.Services.AddScoped<RefreshTokenRepository>();
builder.Services.AddScoped<TrashRepository>();
builder.Services.AddScoped<UserRepository>();

// Add services
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<DashBoardService>();
builder.Services.AddScoped<DeviceService>();
builder.Services.AddScoped<DeviceTypeService>();
builder.Services.AddScoped<DeviceTestingService>();
builder.Services.AddScoped<HistoryService>();
builder.Services.AddScoped<TrashService>();
builder.Services.AddScoped<UserService>();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var key = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();

//// Middleware
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.MapControllers();
app.Run();
