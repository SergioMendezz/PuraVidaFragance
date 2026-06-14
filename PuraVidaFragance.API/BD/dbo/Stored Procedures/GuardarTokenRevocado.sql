
CREATE PROCEDURE GuardarTokenRevocado
    @Id              UNIQUEIDENTIFIER,
    @Token           VARCHAR(500),
    @UsuarioId       UNIQUEIDENTIFIER,
    @FechaExpiracion DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO TokensRevocados (Id, Token, UsuarioId, FechaExpiracion)
    VALUES (@Id, @Token, @UsuarioId, @FechaExpiracion);
END