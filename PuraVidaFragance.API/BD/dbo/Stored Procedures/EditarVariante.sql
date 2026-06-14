
CREATE PROCEDURE EditarVariante
    @Id UNIQUEIDENTIFIER, @Tipo VARCHAR(10),
    @Mililitros DECIMAL(6,2), @Precio DECIMAL(10,2), @Stock INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE VariantesPerfume SET Tipo=@Tipo, Mililitros=@Mililitros,
        Precio=@Precio, Stock=@Stock WHERE Id=@Id;
        SELECT @Id;
    COMMIT TRANSACTION
END