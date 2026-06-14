CREATE TABLE [dbo].[ItemsSet] (
    [Id]           UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [IdSet]        UNIQUEIDENTIFIER NOT NULL,
    [TipoProducto] VARCHAR (20)     NOT NULL,
    [IdProducto]   UNIQUEIDENTIFIER NULL,
    [NombreItem]   VARCHAR (100)    NULL,
    [Cantidad]     INT              DEFAULT ((1)) NOT NULL,
    [Descripcion]  VARCHAR (200)    NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CHK_ItemsSet_Cantidad] CHECK ([Cantidad]>(0)),
    CONSTRAINT [CHK_ItemsSet_Tipo] CHECK ([TipoProducto]='Extra' OR [TipoProducto]='BodySpray' OR [TipoProducto]='Body' OR [TipoProducto]='Perfume'),
    CONSTRAINT [FK_ItemsSet_Set] FOREIGN KEY ([IdSet]) REFERENCES [dbo].[Sets] ([Id])
);

