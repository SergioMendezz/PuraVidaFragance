using BCrypt.Net;

var admins = new[]
{
    new { Nombre = "Sergio Méndez",  Email = "sergiojoel50@gmail.com",  Password = "AdminFragance@04" },
    new { Nombre = "Pablo Hernández",   Email = "puravidafragance@gmail.com",   Password = "AngelVale2!" }
};

foreach (var admin in admins)
{
    var salt = BCrypt.Net.BCrypt.GenerateSalt(12);
    var hash = BCrypt.Net.BCrypt.HashPassword(admin.Password, salt);

    Console.WriteLine($"INSERT INTO Usuarios (Id, NombreUsuario, Email, PasswordHash, PasswordSalt, Rol)");
    Console.WriteLine($"VALUES (NEWID(), '{admin.Nombre}', '{admin.Email}', '{hash}', '{salt}', 'Admin');");
    Console.WriteLine();
}

Console.ReadKey();