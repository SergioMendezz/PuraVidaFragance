using Abstracciones.Interfaces.DA;
using Abstracciones.Interfaces.Flujo;
using DA;
using DA.Repositorios;
using Flujo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Inyección de dependencias
builder.Services.AddScoped<IRepositorioDapper, RepositorioDapper>();

builder.Services.AddScoped<IPerfumeDA, PerfumeDA>();
builder.Services.AddScoped<IVarianteDA, VarianteDA>();
builder.Services.AddScoped<IMarcaDA, MarcaDA>();

builder.Services.AddScoped<IPerfumeFlujo, PerfumeFlujo>();
builder.Services.AddScoped<IVarianteFlujo, VarianteFlujo>();
builder.Services.AddScoped<IMarcaFlujo, MarcaFlujo>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
