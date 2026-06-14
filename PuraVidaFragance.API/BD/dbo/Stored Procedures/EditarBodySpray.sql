
CREATE PROCEDURE EditarBodySpray
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @IdPerfumeBase UNIQUEIDENTIFIER, @Mililitros DECIMAL(6,2),
    @Precio DECIMAL(10,2), @Descripcion TEXT, @ImagenUrl VARCHAR(300),
    @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE BodySprays SET Nombre=@Nombre, IdPerfumeBase=@IdPerfumeBase,
        Mililitros=@Mililitros, Precio=@Precio, Descripcion=@Descripcion,
        ImagenUrl=@ImagenUrl, IdMarca=@IdMarca WHERE Id=@Id;
        SELECT @Id;
    COMMIT TRANSACTION
END