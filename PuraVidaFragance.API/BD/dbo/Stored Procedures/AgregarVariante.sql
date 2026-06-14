
CREATE PROCEDURE AgregarVariante
    @Id UNIQUEIDENTIFIER, @IdPerfume UNIQUEIDENTIFIER,
    @Tipo VARCHAR(10), @Mililitros DECIMAL(6,2),
    @Precio DECIMAL(10,2), @Stock INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO VariantesPerfume (Id, IdPerfume, Tipo, Mililitros, Precio, Stock)
        VALUES (@Id, @IdPerfume, @Tipo, @Mililitros, @Precio, @Stock);
        SELECT @Id;
    COMMIT TRANSACTION
END