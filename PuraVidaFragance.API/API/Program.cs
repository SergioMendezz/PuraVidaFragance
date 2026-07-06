using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using Abstracciones.Interfaces.Servicios;
using DA;
using DA.Repositorios;
using Flujo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Servicios;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingresa el token JWT. Ejemplo: Bearer {token}"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── Inyección de dependencias ──────────────────────────
builder.Services.AddScoped<IRepositorioDapper, RepositorioDapper>();

// DA
builder.Services.AddScoped<IPerfumeDA, PerfumeDA>();
builder.Services.AddScoped<IVarianteDA, VarianteDA>();
builder.Services.AddScoped<IMarcaDA, MarcaDA>();
builder.Services.AddScoped<INotaDA, NotaDA>();
builder.Services.AddScoped<IUsuarioDA, UsuarioDA>();
builder.Services.AddScoped<IBodyDA, BodyDA>();
builder.Services.AddScoped<IBodySprayDA, BodySprayDA>();
builder.Services.AddScoped<ISetDA, SetDA>();

// Flujo 
builder.Services.AddScoped<IPerfumeFlujo, PerfumeFlujo>();
builder.Services.AddScoped<IVarianteFlujo, VarianteFlujo>();
builder.Services.AddScoped<IMarcaFlujo, MarcaFlujo>();
builder.Services.AddScoped<INotaFlujo, NotaFlujo>();
builder.Services.AddScoped<IAuthFlujo, AuthFlujo>();
builder.Services.AddScoped<IBodyFlujo, BodyFlujo>();
builder.Services.AddScoped<IBodySprayFlujo, BodySprayFlujo>();
builder.Services.AddScoped<ISetFlujo, SetFlujo>();

builder.Services.AddScoped<IJwtService, JwtService>();

// ── JWT ────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                                           Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

builder.Services.AddAuthorization();

// ── CORS ───────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
            "https://pura-vida-tienda.vercel.app",
            "https://pura-vida-admin.vercel.app",
            "https://proud-ocean-07db5d210.7.azurestaticapps.net",
            "https://agreeable-bay-00d83e010.7.azurestaticapps.net"

        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();