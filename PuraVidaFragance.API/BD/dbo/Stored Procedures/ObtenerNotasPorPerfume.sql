-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerNotasPorPerfume
    @IdPerfume UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT n.Nombre, n.ColorHex, np.Intensidad
    FROM NotasPerfume np
    INNER JOIN Notas n ON np.IdNota = n.Id
    WHERE np.IdPerfume = @IdPerfume
    ORDER BY np.Intensidad DESC;
END