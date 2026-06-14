
CREATE PROCEDURE AgregarBodySpray
    @Id UNIQUEIDENTIFIER, @Nombre VARCHAR(100),
    @IdPerfumeBase UNIQUEIDENTIFIER, @Mililitros DECIMAL(6,2),
    @Precio DECIMAL(10,2), @Descripcion TEXT, @ImagenUrl VARCHAR(300),
    @IdMarca UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO BodySprays (Id, Nombre, IdPerfumeBase, Mililitros, Precio, Descripcion, ImagenUrl, IdMarca)
        VALUES (@Id, @Nombre, @IdPerfumeBase, @Mililitros, @Precio, @Descripcion, @ImagenUrl, @IdMarca);
        SELECT @Id;
    COMMIT TRANSACTION
END