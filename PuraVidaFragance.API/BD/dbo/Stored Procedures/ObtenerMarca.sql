-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerMarca
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, PaisOrigen, Descripcion, LogoUrl, Activo
    FROM Marcas
    WHERE Id = @Id AND Activo = 1;
END