-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE EliminarNota
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        DELETE FROM NotasPerfume WHERE IdNota = @Id;
        DELETE FROM Notas WHERE Id = @Id;
        SELECT @Id;
    COMMIT TRANSACTION
END