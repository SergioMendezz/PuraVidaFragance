CREATE TABLE [dbo].[VariantesPerfume] (
    [Id]         UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [IdPerfume]  UNIQUEIDENTIFIER NOT NULL,
    [Tipo]       VARCHAR (10)     NOT NULL,
    [Mililitros] DECIMAL (6, 2)   NOT NULL,
    [Precio]     DECIMAL (10, 2)  NOT NULL,
    [Stock]      INT              DEFAULT ((0)) NOT NULL,
    [Activo]     BIT              DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CHK_Variantes_Precio] CHECK ([Precio]>=(0)),
    CONSTRAINT [CHK_Variantes_Stock] CHECK ([Stock]>=(0)),
    CONSTRAINT [CHK_Variantes_Tipo] CHECK ([Tipo]='Decant' OR [Tipo]='Completo'),
    CONSTRAINT [FK_Variantes_Perfume] FOREIGN KEY ([IdPerfume]) REFERENCES [dbo].[Perfumes] ([Id])
);

