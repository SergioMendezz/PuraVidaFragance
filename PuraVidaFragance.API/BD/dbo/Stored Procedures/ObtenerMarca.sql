CREATE PROCEDURE ObtenerMarca
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, PaisOrigen, Descripcion, LogoUrl, Activo
    FROM Marcas WHERE Id = @Id;
END