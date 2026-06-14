
CREATE PROCEDURE ObtenerSets
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.Id, s.Nombre, s.Precio, s.Descripcion,
           s.ImagenUrl, s.Activo, s.IdMarca, m.Nombre AS Marca
    FROM Sets s
    LEFT JOIN Marcas m ON s.IdMarca = m.Id
    ORDER BY s.Nombre;
END