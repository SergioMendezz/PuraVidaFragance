-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE AgregarMarca
    @Id          UNIQUEIDENTIFIER,
    @Nombre      VARCHAR(100),
    @PaisOrigen  VARCHAR(60),
    @Descripcion TEXT,
    @LogoUrl     VARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO Marcas (Id, Nombre, PaisOrigen, Descripcion, LogoUrl)
        VALUES (@Id, @Nombre, @PaisOrigen, @Descripcion, @LogoUrl);
        SELECT @Id;
    COMMIT TRANSACTION
END