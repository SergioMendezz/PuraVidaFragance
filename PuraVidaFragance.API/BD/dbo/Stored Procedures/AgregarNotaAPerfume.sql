
CREATE PROCEDURE AgregarNotaAPerfume
    @Id UNIQUEIDENTIFIER, @IdPerfume UNIQUEIDENTIFIER,
    @IdNota UNIQUEIDENTIFIER, @Intensidad INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO NotasPerfume (Id, IdPerfume, IdNota, Intensidad)
        VALUES (@Id, @IdPerfume, @IdNota, @Intensidad);
        SELECT @Id;
    COMMIT TRANSACTION
END