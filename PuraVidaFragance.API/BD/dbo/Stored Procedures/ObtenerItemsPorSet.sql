
CREATE PROCEDURE ObtenerItemsPorSet
    @IdSet UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.Id, i.IdSet, i.TipoProducto, i.IdProducto,
           i.NombreItem, i.Cantidad, i.Descripcion
    FROM ItemsSet i WHERE i.IdSet = @IdSet;
END