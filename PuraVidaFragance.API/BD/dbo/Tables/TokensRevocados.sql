CREATE TABLE [dbo].[TokensRevocados] (
    [Id]              UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Token]           VARCHAR (500)    NOT NULL,
    [UsuarioId]       UNIQUEIDENTIFIER NOT NULL,
    [FechaRevocacion] DATETIME         DEFAULT (getdate()) NOT NULL,
    [FechaExpiracion] DATETIME         NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TokensRevocados_Usuario] FOREIGN KEY ([UsuarioId]) REFERENCES [dbo].[Usuarios] ([Id])
);

