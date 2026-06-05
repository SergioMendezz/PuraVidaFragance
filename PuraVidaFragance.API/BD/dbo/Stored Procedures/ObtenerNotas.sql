-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE ObtenerNotas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, ColorHex
    FROM Notas
    ORDER BY Nombre ASC;
END