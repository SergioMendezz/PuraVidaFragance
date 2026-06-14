CREATE PROCEDURE ObtenerMarcas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, Activo FROM Marcas ORDER BY Nombre;
END