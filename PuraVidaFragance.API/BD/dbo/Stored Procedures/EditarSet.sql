
CREATE PROCEDURE EditarSet
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @Precio DECIMAL(10,2), @Descripcion TEXT, @ImagenUrl VARCHAR(300),
    @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        UPDATE Sets SET Nombre=@Nombre, Precio=@Precio,
        Descripcion=@Descripcion, ImagenUrl=@ImagenUrl,
        IdMarca=@IdMarca WHERE Id=@Id;
        SELECT @Id;
    COMMIT TRANSACTION
END