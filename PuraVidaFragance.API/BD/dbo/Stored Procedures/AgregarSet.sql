
CREATE PROCEDURE AgregarSet
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @Precio DECIMAL(10,2), @Descripcion TEXT, @ImagenUrl VARCHAR(300),
    @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO Sets (Id, Nombre, Precio, Descripcion, ImagenUrl, IdMarca)
        VALUES (@Id, @Nombre, @Precio, @Descripcion, @ImagenUrl, @IdMarca);
        SELECT @Id;
    COMMIT TRANSACTION
END