
CREATE PROCEDURE ObtenerBody
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT b.Id, b.Nombre, b.Mililitros, b.Precio, b.Descripcion,
           b.ImagenUrl, b.Activo, b.IdMarca, m.Nombre AS Marca
    FROM Bodys b
    LEFT JOIN Marcas m ON b.IdMarca = m.Id
    WHERE b.Id = @Id;
END