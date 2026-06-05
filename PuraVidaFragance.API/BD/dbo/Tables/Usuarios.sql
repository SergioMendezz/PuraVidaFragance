CREATE TABLE [dbo].[Usuarios] (
    [Id]            UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [NombreUsuario] VARCHAR (50)     NOT NULL,
    [Email]         VARCHAR (100)    NOT NULL,
    [PasswordHash]  VARCHAR (256)    NOT NULL,
    [PasswordSalt]  VARCHAR (256)    NOT NULL,
    [Rol]           VARCHAR (20)     DEFAULT ('Admin') NOT NULL,
    [Activo]        BIT              DEFAULT ((1)) NOT NULL,
    [FechaCreacion] DATETIME         DEFAULT (getdate()) NOT NULL,
    [UltimoAcceso]  DATETIME         NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_Usuarios_Email] UNIQUE NONCLUSTERED ([Email] ASC),
    CONSTRAINT [UQ_Usuarios_NombreUsuario] UNIQUE NONCLUSTERED ([NombreUsuario] ASC)
);

