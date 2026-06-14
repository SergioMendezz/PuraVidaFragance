CREATE TABLE [dbo].[NotasPerfume] (
    [Id]         UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [IdPerfume]  UNIQUEIDENTIFIER NOT NULL,
    [IdNota]     UNIQUEIDENTIFIER NOT NULL,
    [Intensidad] INT              NOT NULL,
    [Activo]     BIT              DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CHK_NotasPerfume_Int] CHECK ([Intensidad]>=(1) AND [Intensidad]<=(10)),
    CONSTRAINT [FK_NotasPerfume_Nota] FOREIGN KEY ([IdNota]) REFERENCES [dbo].[Notas] ([Id]),
    CONSTRAINT [FK_NotasPerfume_Perfume] FOREIGN KEY ([IdPerfume]) REFERENCES [dbo].[Perfumes] ([Id]),
    CONSTRAINT [UQ_NotasPerfume] UNIQUE NONCLUSTERED ([IdPerfume] ASC, [IdNota] ASC)
);

