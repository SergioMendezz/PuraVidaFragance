-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE EliminarVariante
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE VariantesPerfume SET Activo = 0 WHERE Id = @Id;
        SELECT @Id;
    COMMIT TRANSACTION
END