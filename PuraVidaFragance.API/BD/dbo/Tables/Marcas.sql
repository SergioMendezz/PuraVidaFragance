CREATE TABLE [dbo].[Marcas] (
    [Id]          UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]      VARCHAR (100)    NOT NULL,
    [PaisOrigen]  VARCHAR (60)     NULL,
    [Descripcion] TEXT             NULL,
    [LogoUrl]     VARCHAR (300)    NULL,
    [Activo]      BIT              DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Marcas_Nombre] UNIQUE NONCLUSTERED ([Nombre] ASC)
);

