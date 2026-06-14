CREATE PROCEDURE AgregarBody
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @Mililitros DECIMAL(6,2), @Precio DECIMAL(10,2),
    @Descripcion TEXT, @ImagenUrl VARCHAR(300), @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO Bodys (Id, Nombre, Mililitros, Precio, Descripcion, ImagenUrl, IdMarca, Activo)
        VALUES (@Id, @Nombre, @Mililitros, @Precio, @Descripcion, @ImagenUrl, @IdMarca, 1);
        SELECT @Id;
    COMMIT TRANSACTION
END