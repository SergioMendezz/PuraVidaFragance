CREATE TABLE [dbo].[Notas] (
    [Id]       UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [Nombre]   VARCHAR (50)     NOT NULL,
    [ColorHex] VARCHAR (7)      NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Notas_Nombre] UNIQUE NONCLUSTERED ([Nombre] ASC)
);

