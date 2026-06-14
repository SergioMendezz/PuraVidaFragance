
CREATE PROCEDURE AgregarItemSet
    @Id UNIQUEIDENTIFIER, @IdSet UNIQUEIDENTIFIER,
    @TipoProducto VARCHAR(20), @IdProducto UNIQUEIDENTIFIER,
    @NombreItem VARCHAR(100), @Cantidad INT, @Descripcion VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO ItemsSet (Id, IdSet, TipoProducto, IdProducto, NombreItem, Cantidad, Descripcion)
        VALUES (@Id, @IdSet, @TipoProducto, @IdProducto, @NombreItem, @Cantidad, @Descripcion);
        SELECT @Id;
    COMMIT TRANSACTION
END