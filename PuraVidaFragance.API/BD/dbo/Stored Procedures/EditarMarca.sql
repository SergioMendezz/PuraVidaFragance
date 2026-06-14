
CREATE PROCEDURE EditarMarca
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @PaisOrigen VARCHAR(60), @Descripcion TEXT, @LogoUrl VARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE Marcas SET Nombre=@Nombre, PaisOrigen=@PaisOrigen,
        Descripcion=@Descripcion, LogoUrl=@LogoUrl WHERE Id=@Id;
        SELECT @Id;
    COMMIT TRANSACTION
END