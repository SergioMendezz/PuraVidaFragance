-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE AgregarPerfume
    @Id          UNIQUEIDENTIFIER,
    @IdMarca     UNIQUEIDENTIFIER,
    @Nombre      VARCHAR(100),
    @Genero      VARCHAR(10),
    @Descripcion TEXT,
    @ImagenUrl   VARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO Perfumes (Id, IdMarca, Nombre, Genero, Descripcion, ImagenUrl)
        VALUES (@Id, @IdMarca, @Nombre, @Genero, @Descripcion, @ImagenUrl);
        SELECT @Id;
    COMMIT TRANSACTION
END