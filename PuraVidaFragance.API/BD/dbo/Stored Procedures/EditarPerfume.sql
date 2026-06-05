-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE EditarPerfume
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
        UPDATE Perfumes
        SET IdMarca     = @IdMarca,
            Nombre      = @Nombre,
            Genero      = @Genero,
            Descripcion = @Descripcion,
            ImagenUrl   = @ImagenUrl
        WHERE Id = @Id;
        SELECT @Id;
    COMMIT TRANSACTION
END