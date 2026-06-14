
CREATE PROCEDURE ObtenerSet
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.Id, s.Nombre, s.Precio, s.Descripcion,
           s.ImagenUrl, s.Activo, s.IdMarca, m.Nombre AS Marca
    FROM Sets s
    LEFT JOIN Marcas m ON s.IdMarca = m.Id
    WHERE s.Id = @Id;
END