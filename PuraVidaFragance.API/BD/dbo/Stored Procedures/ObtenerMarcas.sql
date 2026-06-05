-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerMarcas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, PaisOrigen, Descripcion, LogoUrl, Activo
    FROM Marcas
    WHERE Activo = 1;
END