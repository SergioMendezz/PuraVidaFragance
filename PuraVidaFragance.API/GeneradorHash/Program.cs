using BCrypt.Net;

var salt1 = BCrypt.Net.BCrypt.GenerateSalt(12);
var hash1 = BCrypt.Net.BCrypt.HashPassword("TuPassword1!", salt1);

var salt2 = BCrypt.Net.BCrypt.GenerateSalt(12);
var hash2 = BCrypt.Net.BCrypt.HashPassword("TuPassword2!", salt2);

Console.WriteLine($"INSERT INTO Usuarios (Id, NombreUsuario, Email, PasswordHash, PasswordSalt, Rol)");
Console.WriteLine($"VALUES (NEWID(), 'Sergio Mendez', 'sergiojoel50@gmail.com', '{hash1}', '{salt1}', 'Admin');");
Console.WriteLine();
Console.WriteLine($"INSERT INTO Usuarios (Id, NombreUsuario, Email, PasswordHash, PasswordSalt, Rol)");
Console.WriteLine($"VALUES (NEWID(), 'Pablo', 'puravidafragance@gmail.com', '{hash2}', '{salt2}', 'Admin');");

Console.ReadKey();
