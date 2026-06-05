-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE EliminarMarca
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE Marcas SET Activo = 0 WHERE Id = @Id;
        SELECT @Id;
    COMMIT TRANSACTION
END