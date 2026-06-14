
CREATE PROCEDURE ObtenerBodySprays
AS
BEGIN
    SET NOCOUNT ON;
    SELECT bs.Id, bs.Nombre, bs.IdPerfumeBase, bs.Mililitros,
           bs.Precio, bs.Descripcion, bs.ImagenUrl, bs.Activo,
           bs.IdMarca, m.Nombre AS Marca,
           p.Nombre AS NombrePerfumeBase
    FROM BodySprays bs
    LEFT JOIN Marcas m ON bs.IdMarca = m.Id
    LEFT JOIN Perfumes p ON bs.IdPerfumeBase = p.Id
    ORDER BY bs.Nombre;
END