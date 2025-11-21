-- Base de datos para ZonaPixel
CREATE DATABASE IF NOT EXISTS zonapixel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zonapixel_db;

-- Tabla de Roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL DEFAULT 2,
    imagen_perfil VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_nombre_usuario (nombre_usuario)
) ENGINE=InnoDB;

-- Tabla de Categorías (para clasificar contenido)
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_categoria VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- Tabla de Juegos
CREATE TABLE juegos (
    id_juego INT PRIMARY KEY AUTO_INCREMENT,
    nombre_juego VARCHAR(200) NOT NULL,
    descripcion TEXT,
    desarrollador VARCHAR(150),
    fecha_lanzamiento DATE,
    plataformas VARCHAR(255),
    imagen_portada VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_nombre_juego (nombre_juego)
) ENGINE=InnoDB;

-- Tabla de Artículos
CREATE TABLE articulos (
    id_articulo INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido LONGTEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_juego INT,
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL,
    INDEX idx_titulo (titulo),
    INDEX idx_fecha_publicacion (fecha_publicacion)
) ENGINE=InnoDB;

-- Tabla de Reseñas
CREATE TABLE resenas (
    id_resena INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido LONGTEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_juego INT NOT NULL,
    calificacion_grafica DECIMAL(3,1) CHECK (calificacion_grafica >= 0 AND calificacion_grafica <= 10),
    calificacion_gameplay DECIMAL(3,1) CHECK (calificacion_gameplay >= 0 AND calificacion_gameplay <= 10),
    calificacion_sonido DECIMAL(3,1) CHECK (calificacion_sonido >= 0 AND calificacion_sonido <= 10),
    calificacion_general DECIMAL(3,1) CHECK (calificacion_general >= 0 AND calificacion_general <= 10),
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE,
    INDEX idx_titulo (titulo),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_calificacion_general (calificacion_general)
) ENGINE=InnoDB;

-- Tabla de Entrevistas
CREATE TABLE entrevistas (
    id_entrevista INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido LONGTEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    entrevistado VARCHAR(200),
    cargo_entrevistado VARCHAR(150),
    video_url VARCHAR(500),
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    INDEX idx_titulo (titulo),
    INDEX idx_fecha_publicacion (fecha_publicacion)
) ENGINE=InnoDB;

-- Tabla de Opiniones (usuarios comunes pueden crear)
CREATE TABLE opiniones (
    id_opinion INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido LONGTEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_juego INT,
    calificacion_estrellas INT CHECK (calificacion_estrellas >= 1 AND calificacion_estrellas <= 5),
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL,
    INDEX idx_titulo (titulo),
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_autor (id_autor)
) ENGINE=InnoDB;

-- Tabla de Comentarios (para opiniones)
CREATE TABLE comentarios (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    id_opinion INT NOT NULL,
    id_autor INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_opinion (id_opinion),
    INDEX idx_fecha_publicacion (fecha_publicacion)
) ENGINE=InnoDB;

-- Tabla de Calificaciones de Opiniones (usuarios califican opiniones de otros)
CREATE TABLE calificaciones_opiniones (
    id_calificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_opinion INT NOT NULL,
    id_usuario INT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_calificacion (id_opinion, id_usuario),
    INDEX idx_opinion (id_opinion)
) ENGINE=InnoDB;

-- Tabla de Imágenes (para múltiples imágenes en un contenido)
CREATE TABLE imagenes (
    id_imagen INT PRIMARY KEY AUTO_INCREMENT,
    tipo_contenido ENUM('articulo', 'resena', 'entrevista', 'opinion') NOT NULL,
    id_contenido INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    orden INT DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contenido (tipo_contenido, id_contenido)
) ENGINE=InnoDB;

-- Insertar roles por defecto
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso completo al sistema, puede crear y gestionar todo el contenido'),
('Usuario', 'Usuario común, puede ver contenido y crear opiniones');

-- Insertar categorías por defecto
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Acción', 'Juegos de acción y aventura'),
('RPG', 'Juegos de rol'),
('Estrategia', 'Juegos de estrategia'),
('Deportes', 'Juegos deportivos'),
('Simulación', 'Juegos de simulación'),
('Aventura', 'Juegos de aventura'),
('Terror', 'Juegos de terror'),
('Multijugador', 'Juegos multijugador');

-- Crear usuario administrador de ejemplo (password: admin123 - debe cambiarse)
-- NOTA: En producción, usa un hash real con password_hash() de PHP
INSERT INTO usuarios (nombre_usuario, email, password_hash, id_rol) VALUES
('admin', 'admin@zonapixel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Vista para obtener opiniones con calificación promedio
CREATE VIEW vista_opiniones_calificadas AS
SELECT 
    o.*,
    u.nombre_usuario,
    u.imagen_perfil,
    c.nombre_categoria,
    j.nombre_juego,
    COALESCE(AVG(co.calificacion), 0) as calificacion_promedio,
    COUNT(DISTINCT co.id_calificacion) as total_calificaciones,
    COUNT(DISTINCT com.id_comentario) as total_comentarios
FROM opiniones o
LEFT JOIN usuarios u ON o.id_autor = u.id_usuario
LEFT JOIN categorias c ON o.id_categoria = c.id_categoria
LEFT JOIN juegos j ON o.id_juego = j.id_juego
LEFT JOIN calificaciones_opiniones co ON o.id_opinion = co.id_opinion
LEFT JOIN comentarios com ON o.id_opinion = com.id_opinion
GROUP BY o.id_opinion;

-- Vista para reseñas con información relacionada
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

-- Procedimiento almacenado para obtener estadísticas de usuario
DELIMITER //
CREATE PROCEDURE estadisticas_usuario(IN p_id_usuario INT)
BEGIN
    SELECT 
        COUNT(DISTINCT o.id_opinion) as total_opiniones,
        COUNT(DISTINCT c.id_comentario) as total_comentarios,
        COUNT(DISTINCT co.id_calificacion) as total_calificaciones_dadas,
        COALESCE(AVG(co2.calificacion), 0) as calificacion_promedio_recibida
    FROM usuarios u
    LEFT JOIN opiniones o ON u.id_usuario = o.id_autor
    LEFT JOIN comentarios c ON u.id_usuario = c.id_autor
    LEFT JOIN calificaciones_opiniones co ON u.id_usuario = co.id_usuario
    LEFT JOIN opiniones o2 ON u.id_usuario = o2.id_autor
    LEFT JOIN calificaciones_opiniones co2 ON o2.id_opinion = co2.id_opinion
    WHERE u.id_usuario = p_id_usuario;
END //
DELIMITER ;