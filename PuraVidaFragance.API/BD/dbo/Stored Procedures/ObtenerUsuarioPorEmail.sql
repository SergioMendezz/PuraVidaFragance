CREATE PROCEDURE ObtenerUsuarioPorEmail
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, NombreUsuario, Email, PasswordHash, PasswordSalt,
           Rol, Activo, FechaCreacion, UltimoAcceso
    FROM Usuarios
    WHERE Email = @Email AND Activo = 1;
END