CREATE TABLE [dbo].[Bodys] (
    [Id]            UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]        VARCHAR (100)    NOT NULL,
    [Mililitros]    DECIMAL (6, 2)   NOT NULL,
    [Precio]        DECIMAL (10, 2)  NOT NULL,
    [Descripcion]   TEXT             NULL,
    [ImagenUrl]     VARCHAR (300)    NULL,
    [Activo]        BIT              DEFAULT ((1)) NOT NULL,
    [FechaCreacion] DATETIME         DEFAULT (getdate()) NOT NULL,
    [IdMarca]       UNIQUEIDENTIFIER NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CHK_Bodys_Precio] CHECK ([Precio]>=(0)),
    CONSTRAINT [FK_Bodys_Marca] FOREIGN KEY ([IdMarca]) REFERENCES [dbo].[Marcas] ([Id])
);

