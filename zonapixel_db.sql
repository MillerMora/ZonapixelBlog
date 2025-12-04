IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'zonapixel_db')
BEGIN
    CREATE DATABASE zonapixel_db
    COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE zonapixel_db;
GO

-- Tabla de Roles
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[roles]') AND type in (N'U'))
BEGIN
    CREATE TABLE roles (
        id_rol INT PRIMARY KEY IDENTITY(1,1),
        nombre_rol VARCHAR(50) NOT NULL UNIQUE,
        descripcion NVARCHAR(MAX),
        fecha_creacion DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usuarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE usuarios (
        id_usuario INT PRIMARY KEY IDENTITY(1,1),
        nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        id_rol INT NOT NULL DEFAULT 2,
        imagen_perfil VARCHAR(255),
        fecha_registro DATETIME2 DEFAULT GETDATE(),
        ultimo_acceso DATETIME2 NULL,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
    );
    
    CREATE INDEX idx_email ON usuarios(email);
    CREATE INDEX idx_nombre_usuario ON usuarios(nombre_usuario);
END
GO

-- Tabla de Categorías
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[categorias]') AND type in (N'U'))
BEGIN
    CREATE TABLE categorias (
        id_categoria INT PRIMARY KEY IDENTITY(1,1),
        nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
        descripcion NVARCHAR(MAX),
        imagen_categoria VARCHAR(255),
        fecha_creacion DATETIME2 DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
END
GO

-- Tabla de Juegos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[juegos]') AND type in (N'U'))
BEGIN
    CREATE TABLE juegos (
        id_juego INT PRIMARY KEY IDENTITY(1,1),
        nombre_juego VARCHAR(200) NOT NULL,
        descripcion NVARCHAR(MAX),
        desarrollador VARCHAR(150),
        fecha_lanzamiento DATE,
        plataformas VARCHAR(255),
        imagen_portada VARCHAR(255),
        fecha_creacion DATETIME2 DEFAULT GETDATE(),
        activo BIT DEFAULT 1
    );
    
    CREATE INDEX idx_nombre_juego ON juegos(nombre_juego);
END
GO

-- Tabla de Artículos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[articulos]') AND type in (N'U'))
BEGIN
    CREATE TABLE articulos (
        id_articulo INT PRIMARY KEY IDENTITY(1,1),
        titulo VARCHAR(255) NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        id_autor INT NOT NULL,
        id_categoria INT,
        id_juego INT,
        imagen_principal VARCHAR(255),
        fecha_publicacion DATETIME2 DEFAULT GETDATE(),
        fecha_modificacion DATETIME2 NULL,
        vistas INT DEFAULT 0,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_articulos_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_articulos_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
        CONSTRAINT FK_articulos_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL
    );
    
    CREATE INDEX idx_titulo ON articulos(titulo);
    CREATE INDEX idx_fecha_publicacion ON articulos(fecha_publicacion);
END
GO

-- Trigger para actualizar fecha_modificacion en artículos
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_articulos_update')
    DROP TRIGGER trg_articulos_update;
GO

CREATE TRIGGER trg_articulos_update
ON articulos
AFTER UPDATE
AS
BEGIN
    UPDATE articulos
    SET fecha_modificacion = GETDATE()
    FROM articulos a
    INNER JOIN inserted i ON a.id_articulo = i.id_articulo;
END
GO

-- Tabla de Reseñas
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[resenas]') AND type in (N'U'))
BEGIN
    CREATE TABLE resenas (
        id_resena INT PRIMARY KEY IDENTITY(1,1),
        titulo VARCHAR(255) NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        id_autor INT NOT NULL,
        id_categoria INT,
        id_juego INT NOT NULL,
        calificacion_grafica DECIMAL(3,1) CHECK (calificacion_grafica >= 0 AND calificacion_grafica <= 10),
        calificacion_gameplay DECIMAL(3,1) CHECK (calificacion_gameplay >= 0 AND calificacion_gameplay <= 10),
        calificacion_sonido DECIMAL(3,1) CHECK (calificacion_sonido >= 0 AND calificacion_sonido <= 10),
        calificacion_general DECIMAL(3,1) CHECK (calificacion_general >= 0 AND calificacion_general <= 10),
        imagen_principal VARCHAR(255),
        fecha_publicacion DATETIME2 DEFAULT GETDATE(),
        fecha_modificacion DATETIME2 NULL,
        vistas INT DEFAULT 0,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_resenas_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_resenas_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
        CONSTRAINT FK_resenas_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego)
    );
    
    CREATE INDEX idx_titulo_resenas ON resenas(titulo);
    CREATE INDEX idx_fecha_publicacion_resenas ON resenas(fecha_publicacion);
    CREATE INDEX idx_calificacion_general ON resenas(calificacion_general);
END
GO

-- Trigger para actualizar fecha_modificacion en reseñas
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_resenas_update')
    DROP TRIGGER trg_resenas_update;
GO

CREATE TRIGGER trg_resenas_update
ON resenas
AFTER UPDATE
AS
BEGIN
    UPDATE resenas
    SET fecha_modificacion = GETDATE()
    FROM resenas r
    INNER JOIN inserted i ON r.id_resena = i.id_resena;
END
GO

-- Tabla de Entrevistas
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[entrevistas]') AND type in (N'U'))
BEGIN
    CREATE TABLE entrevistas (
        id_entrevista INT PRIMARY KEY IDENTITY(1,1),
        titulo VARCHAR(255) NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        id_autor INT NOT NULL,
        id_categoria INT,
        entrevistado VARCHAR(200),
        cargo_entrevistado VARCHAR(150),
        video_url VARCHAR(500),
        imagen_principal VARCHAR(255),
        fecha_publicacion DATETIME2 DEFAULT GETDATE(),
        fecha_modificacion DATETIME2 NULL,
        vistas INT DEFAULT 0,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_entrevistas_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_entrevistas_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL
    );
    
    CREATE INDEX idx_titulo_entrevistas ON entrevistas(titulo);
    CREATE INDEX idx_fecha_publicacion_entrevistas ON entrevistas(fecha_publicacion);
END
GO

-- Trigger para actualizar fecha_modificacion en entrevistas
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_entrevistas_update')
    DROP TRIGGER trg_entrevistas_update;
GO

CREATE TRIGGER trg_entrevistas_update
ON entrevistas
AFTER UPDATE
AS
BEGIN
    UPDATE entrevistas
    SET fecha_modificacion = GETDATE()
    FROM entrevistas e
    INNER JOIN inserted i ON e.id_entrevista = i.id_entrevista;
END
GO

-- Tabla de Opiniones
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[opiniones]') AND type in (N'U'))
BEGIN
    CREATE TABLE opiniones (
        id_opinion INT PRIMARY KEY IDENTITY(1,1),
        titulo VARCHAR(255) NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        id_autor INT NOT NULL,
        id_categoria INT,
        id_juego INT,
        calificacion_estrellas INT CHECK (calificacion_estrellas >= 1 AND calificacion_estrellas <= 5),
        imagen_principal VARCHAR(255),
        fecha_publicacion DATETIME2 DEFAULT GETDATE(),
        fecha_modificacion DATETIME2 NULL,
        vistas INT DEFAULT 0,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_opiniones_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        CONSTRAINT FK_opiniones_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
        CONSTRAINT FK_opiniones_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL
    );
    
    CREATE INDEX idx_titulo_opiniones ON opiniones(titulo);
    CREATE INDEX idx_fecha_publicacion_opiniones ON opiniones(fecha_publicacion);
    CREATE INDEX idx_autor ON opiniones(id_autor);
END
GO

-- Trigger para actualizar fecha_modificacion en opiniones
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_opiniones_update')
    DROP TRIGGER trg_opiniones_update;
GO

CREATE TRIGGER trg_opiniones_update
ON opiniones
AFTER UPDATE
AS
BEGIN
    UPDATE opiniones
    SET fecha_modificacion = GETDATE()
    FROM opiniones o
    INNER JOIN inserted i ON o.id_opinion = i.id_opinion;
END
GO

-- Tabla de Comentarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[comentarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE comentarios (
        id_comentario INT PRIMARY KEY IDENTITY(1,1),
        id_opinion INT NOT NULL,
        id_autor INT NOT NULL,
        contenido NVARCHAR(MAX) NOT NULL,
        fecha_publicacion DATETIME2 DEFAULT GETDATE(),
        fecha_modificacion DATETIME2 NULL,
        activo BIT DEFAULT 1,
        CONSTRAINT FK_comentarios_opiniones FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
        CONSTRAINT FK_comentarios_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario)
    );
    
    CREATE INDEX idx_opinion ON comentarios(id_opinion);
    CREATE INDEX idx_fecha_publicacion_comentarios ON comentarios(fecha_publicacion);
END
GO

-- Trigger para actualizar fecha_modificacion en comentarios
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_comentarios_update')
    DROP TRIGGER trg_comentarios_update;
GO

CREATE TRIGGER trg_comentarios_update
ON comentarios
AFTER UPDATE
AS
BEGIN
    UPDATE comentarios
    SET fecha_modificacion = GETDATE()
    FROM comentarios c
    INNER JOIN inserted i ON c.id_comentario = i.id_comentario;
END
GO

-- Tabla de Calificaciones de Opiniones
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[calificaciones_opiniones]') AND type in (N'U'))
BEGIN
    CREATE TABLE calificaciones_opiniones (
        id_calificacion INT PRIMARY KEY IDENTITY(1,1),
        id_opinion INT NOT NULL,
        id_usuario INT NOT NULL,
        calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
        fecha_calificacion DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_calificaciones_opiniones FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
        CONSTRAINT FK_calificaciones_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        CONSTRAINT unique_calificacion UNIQUE (id_opinion, id_usuario)
    );
    
    CREATE INDEX idx_opinion_calificaciones ON calificaciones_opiniones(id_opinion);
END
GO

-- Tabla de Imágenes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[imagenes]') AND type in (N'U'))
BEGIN
    CREATE TABLE imagenes (
        id_imagen INT PRIMARY KEY IDENTITY(1,1),
        tipo_contenido VARCHAR(20) NOT NULL CHECK (tipo_contenido IN ('articulo', 'resena', 'entrevista', 'opinion', 'proyecto')),
        id_contenido INT NOT NULL,
        url_imagen VARCHAR(255) NOT NULL,
        descripcion VARCHAR(255),
        orden INT DEFAULT 0,
        fecha_subida DATETIME2 DEFAULT GETDATE()
    );

    CREATE INDEX idx_contenido ON imagenes(tipo_contenido, id_contenido);
END
GO

-- Insertar roles por defecto
IF NOT EXISTS (SELECT * FROM roles WHERE nombre_rol = 'Administrador')
BEGIN
    INSERT INTO roles (nombre_rol, descripcion) VALUES
    ('Administrador', 'Acceso completo al sistema, puede crear y gestionar todo el contenido'),
    ('Usuario', 'Usuario común, puede ver contenido y crear opiniones');
END
GO

-- Insertar categorías por defecto
IF NOT EXISTS (SELECT * FROM categorias WHERE nombre_categoria = 'Acción')
BEGIN
    INSERT INTO categorias (nombre_categoria, descripcion) VALUES
    ('Acción', 'Juegos de acción y aventura'),
    ('RPG', 'Juegos de rol'),
    ('Estrategia', 'Juegos de estrategia'),
    ('Deportes', 'Juegos deportivos'),
    ('Simulación', 'Juegos de simulación'),
    ('Aventura', 'Juegos de aventura'),
    ('Terror', 'Juegos de terror'),
    ('Multijugador', 'Juegos multijugador');
END
GO

-- Crear usuario administrador de ejemplo
IF NOT EXISTS (SELECT * FROM usuarios WHERE nombre_usuario = 'admin')
BEGIN
    INSERT INTO usuarios (nombre_usuario, email, password_hash, id_rol) VALUES
    ('admin', 'admin@zonapixel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);
END
GO

-- Vista para obtener opiniones con calificación promedio
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vista_opiniones_calificadas')
    DROP VIEW vista_opiniones_calificadas;
GO

CREATE VIEW vista_opiniones_calificadas AS
SELECT 
    o.*,
    u.nombre_usuario,
    u.imagen_perfil,
    c.nombre_categoria,
    j.nombre_juego,
    COALESCE(AVG(CAST(co.calificacion AS FLOAT)), 0) as calificacion_promedio,
    COUNT(DISTINCT co.id_calificacion) as total_calificaciones,
    COUNT(DISTINCT com.id_comentario) as total_comentarios
FROM opiniones o
LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
LEFT JOIN juegos j ON o.id_juego = j.id_juego
LEFT JOIN calificaciones_opiniones co ON o.id_opinion = co.id_opinion
LEFT JOIN comentarios com ON o.id_opinion = com.id_opinion
GROUP BY 
    o.id_opinion, o.titulo, o.contenido, o.id_autor, o.id_categoria, o.id_juego,
    o.calificacion_estrellas, o.imagen_principal, o.fecha_publicacion, 
    o.fecha_modificacion, o.vistas, o.activo,
    u.nombre_usuario, u.imagen_perfil, c.nombre_categoria, j.nombre_juego;
GO

-- Vista para reseñas con información relacionada
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vista_resenas_completas')
    DROP VIEW vista_resenas_completas;
GO

CREATE VIEW vista_resenas_completas AS
SELECT 
    r.*,
    u.nombre_usuario,
    c.nombre_categoria,
    j.nombre_juego,
    j.desarrollador
FROM resenas r
LEFT JOIN usuarios u ON r.id_autor = u.id_usuario
LEFT JOIN categorias c ON r.id_categoria = c.id_categoria
LEFT JOIN juegos j ON r.id_juego = j.id_juego;
GO

-- Procedimiento almacenado para obtener estadísticas de usuario
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'estadisticas_usuario')
    DROP PROCEDURE estadisticas_usuario;
GO

CREATE PROCEDURE estadisticas_usuario
    @p_id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(DISTINCT o.id_opinion) as total_opiniones,
        COUNT(DISTINCT c.id_comentario) as total_comentarios,
        COUNT(DISTINCT co.id_calificacion) as total_calificaciones_dadas,
        COALESCE(AVG(CAST(co2.calificacion AS FLOAT)), 0) as calificacion_promedio_recibida
    FROM usuarios u
    LEFT JOIN opiniones o ON u.id_usuario = o.id_autor
    LEFT JOIN comentarios c ON u.id_usuario = c.id_autor
    LEFT JOIN calificaciones_opiniones co ON u.id_usuario = co.id_usuario
    LEFT JOIN opiniones o2 ON u.id_usuario = o2.id_autor
    LEFT JOIN calificaciones_opiniones co2 ON o2.id_opinion = co2.id_opinion
    WHERE u.id_usuario = @p_id_usuario;
END
GO