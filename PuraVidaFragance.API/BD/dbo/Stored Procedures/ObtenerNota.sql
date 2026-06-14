
CREATE PROCEDURE ObtenerNota
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Nombre, ColorHex, Activo
    FROM Notas WHERE Id = @Id;
END