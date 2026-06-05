CREATE TABLE [dbo].[Perfumes] (
    [Id]            UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [IdMarca]       UNIQUEIDENTIFIER NOT NULL,
    [Nombre]        VARCHAR (100)    NOT NULL,
    [Genero]        VARCHAR (10)     NOT NULL,
    [Descripcion]   TEXT             NULL,
    [ImagenUrl]     VARCHAR (300)    NULL,
    [Activo]        BIT              DEFAULT ((1)) NOT NULL,
    [FechaCreacion] DATETIME         DEFAULT (getdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CHK_Perfumes_Genero] CHECK ([Genero]='Unisex' OR [Genero]='Mujer' OR [Genero]='Hombre'),
    CONSTRAINT [FK_Perfumes_Marca] FOREIGN KEY ([IdMarca]) REFERENCES [dbo].[Marcas] ([Id])
);

