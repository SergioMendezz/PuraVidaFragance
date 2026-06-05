-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerVariantesPorPerfume
    @IdPerfume UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Tipo, Mililitros, Precio, Stock
    FROM VariantesPerfume
    WHERE IdPerfume = @IdPerfume AND Activo = 1;
END