CREATE PROCEDURE ObtenerNotas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, ColorHex, Activo FROM Notas ORDER BY Nombre;
END