
CREATE PROCEDURE TokenEstaRevocado
    @Token VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT COUNT(1) FROM TokensRevocados
    WHERE Token = @Token AND FechaExpiracion > GETDATE();
END