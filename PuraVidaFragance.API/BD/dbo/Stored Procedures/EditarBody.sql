
CREATE PROCEDURE EditarBody
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @Mililitros DECIMAL(6,2), @Precio DECIMAL(10,2),
    @Descripcion TEXT, @ImagenUrl VARCHAR(300), @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE Bodys SET Nombre=@Nombre, Mililitros=@Mililitros,
        Precio=@Precio, Descripcion=@Descripcion, ImagenUrl=@ImagenUrl,
        IdMarca=@IdMarca WHERE Id=@Id;
        SELECT @Id;
    COMMIT TRANSACTION
END