-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerPerfume
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        p.Id, p.Nombre, p.Genero, p.Descripcion, p.ImagenUrl,
        m.Nombre AS Marca
    FROM Perfumes p
    INNER JOIN Marcas m ON p.IdMarca = m.Id
    WHERE p.Id = @Id AND p.Activo = 1;
END