
CREATE PROCEDURE ObtenerPerfumes
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.Id, p.Nombre, p.Descripcion, p.Genero, p.ImagenUrl, p.Activo,
           m.Nombre AS Marca, m.Id AS IdMarca
    FROM Perfumes p
    LEFT JOIN Marcas m ON p.IdMarca = m.Id
    ORDER BY p.Nombre;
END