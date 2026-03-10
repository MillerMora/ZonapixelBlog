CREATE DATABASE IF NOT EXISTS zonapixel_db
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE zonapixel_db;

CREATE TABLE IF NOT EXISTS roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador', 'Acceso completo al sistema, puede crear y gestionar todo el contenido'),
('Usuario', 'Usuario común, puede ver contenido y crear opiniones');

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(25) NOT NULL,
    apellido VARCHAR(25) NOT NULL,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL DEFAULT 2,
    imagen_perfil VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    INDEX idx_email (email),
    INDEX idx_nombre_usuario (nombre_usuario)
);

INSERT INTO usuarios (nombre,apellido,nombre_usuario, email, password_hash, id_rol) VALUES
('nombre','apellido','admin', 'admin@zonapixel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('juan','gonzalez','usuario', 'usuario@gmail.com', 'contraseña123#45678', 2);

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- 1. GENEROS
--    Catálogo de géneros de videojuegos
-- ============================================================
CREATE TABLE IF NOT EXISTS generos (
    id         INT          NOT NULL AUTO_INCREMENT,
    nombre     VARCHAR(80)  NOT NULL,
    slug       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_generos_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Géneros de videojuegos: RPG, Shooter, Aventura, etc.';


-- ============================================================
-- 2. VIDEOJUEGOS
--    Entidad central del portal
-- ============================================================
CREATE TABLE IF NOT EXISTS videojuegos (
    id                INT          NOT NULL AUTO_INCREMENT,
    titulo            VARCHAR(200) NOT NULL,
    slug              VARCHAR(220) NOT NULL,
    desarrollador     VARCHAR(150) NOT NULL  COMMENT 'Estudio o persona que lo desarrolló',
    distribuidora     VARCHAR(150)            COMMENT 'Puede coincidir con desarrollador',
    fecha_lanzamiento DATE                    COMMENT 'Fecha de lanzamiento oficial',
    plataformas       VARCHAR(255)            COMMENT 'PC, PS5, Xbox Series X... (separado por comas)',
    descripcion       TEXT                    COMMENT 'Sinopsis general del juego',
    imagen_portada    VARCHAR(500)            COMMENT 'Ruta o URL de la imagen de portada',
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_videojuegos_slug (slug),
    INDEX idx_videojuegos_titulo (titulo),
    INDEX idx_videojuegos_fecha  (fecha_lanzamiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de videojuegos referenciados en el portal';


-- ============================================================
-- 3. VIDEOJUEGO_GENERO
--    N:M — un juego puede pertenecer a varios géneros
-- ============================================================
CREATE TABLE IF NOT EXISTS videojuego_genero (
    videojuego_id INT NOT NULL,
    genero_id     INT NOT NULL,

    PRIMARY KEY (videojuego_id, genero_id),
    INDEX idx_vg_genero (genero_id),

    CONSTRAINT fk_vg_videojuego
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_vg_genero
        FOREIGN KEY (genero_id) REFERENCES generos (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Relación muchos a muchos entre videojuegos y géneros';


-- ============================================================
-- 4. RESENAS
--    Análisis profesionales extensos del equipo editorial.
--    Tienen secciones propias (jugabilidad, narrativa, gráficos)
--    además del cuerpo principal. Reciben comentarios anidados.
-- ============================================================
CREATE TABLE IF NOT EXISTS resenas (
    id                INT           NOT NULL AUTO_INCREMENT,
    videojuego_id     INT           NOT NULL,
    genero_id         INT                    COMMENT 'Género principal de la reseña',
    autor_id          INT           NOT NULL  COMMENT 'FK a usuarios (rol Administrador)',
    titulo            VARCHAR(250)  NOT NULL,
    slug              VARCHAR(270)  NOT NULL,
    contenido         LONGTEXT      NOT NULL  COMMENT 'Cuerpo principal — múltiples párrafos, sin límite',
    jugabilidad       TEXT                    COMMENT 'Sección: análisis de jugabilidad',
    narrativa         TEXT                    COMMENT 'Sección: análisis de narrativa',
    graficos          TEXT                    COMMENT 'Sección: análisis de gráficos',
    puntuacion        DECIMAL(3,1)  NOT NULL  COMMENT 'Nota general 0.0 – 10.0',
    imagen_destacada  VARCHAR(500)            COMMENT 'Imagen principal de la reseña',
    destacada         TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '1 = aparece destacada en portada',
    fecha_publicacion DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_resenas_slug      (slug),
    INDEX idx_resenas_videojuego    (videojuego_id),
    INDEX idx_resenas_autor         (autor_id),
    INDEX idx_resenas_genero        (genero_id),
    INDEX idx_resenas_destacada     (destacada),
    INDEX idx_resenas_fecha         (fecha_publicacion),

    CONSTRAINT chk_resenas_puntuacion CHECK (puntuacion BETWEEN 0.0 AND 10.0),

    CONSTRAINT fk_resenas_videojuego
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_resenas_genero
        FOREIGN KEY (genero_id) REFERENCES generos (id)
        ON DELETE SET NULL ON UPDATE CASCADE,

    CONSTRAINT fk_resenas_autor
        FOREIGN KEY (autor_id) REFERENCES usuarios (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Reseñas profesionales extensas de videojuegos';


-- ============================================================
-- 5. CATEGORIAS_ARTICULOS
--    Catálogo de categorías editoriales
--    Ej: Noticias, Hardware Gaming, Cultura Gamer, Indie,
--        Análisis Tecnológico (IA, Cloud, VR), Tendencias...
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias_articulos (
    id          INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL,
    descripcion VARCHAR(300)           COMMENT 'Descripción corta de la categoría',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_cat_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Categorías para artículos editoriales';


-- ============================================================
-- 6. ARTICULOS
--    Contenido editorial extenso: noticias, análisis, cultura.
--    Reciben comentarios anidados en su página individual.
-- ============================================================
CREATE TABLE IF NOT EXISTS articulos (
    id                INT           NOT NULL AUTO_INCREMENT,
    categoria_id      INT           NOT NULL,
    autor_id          INT           NOT NULL  COMMENT 'FK a usuarios (rol Administrador)',
    titulo            VARCHAR(300)  NOT NULL,
    slug              VARCHAR(320)  NOT NULL,
    contenido         LONGTEXT      NOT NULL  COMMENT 'Cuerpo completo — sin límite de caracteres',
    extracto          VARCHAR(600)            COMMENT 'Resumen corto para tarjetas en el listado',
    imagen_destacada  VARCHAR(500)            COMMENT 'Imagen principal del artículo',
    estado            ENUM('borrador','publicado') NOT NULL DEFAULT 'borrador',
    fecha_publicacion DATETIME                COMMENT 'NULL mientras sea borrador',
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_articulos_slug  (slug),
    INDEX idx_articulos_categoria (categoria_id),
    INDEX idx_articulos_autor     (autor_id),
    INDEX idx_articulos_estado    (estado),
    INDEX idx_articulos_fecha     (fecha_publicacion),

    CONSTRAINT fk_articulos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias_articulos (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_articulos_autor
        FOREIGN KEY (autor_id) REFERENCES usuarios (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Artículos editoriales extensos sobre la industria gaming';


-- ============================================================
-- 7. COMENTARIOS
--    Hilo de discusión al pie de un artículo O una reseña.
--
--    ANIDAMIENTO: padre_id apunta al comentario que se responde.
--    NULL en padre_id = comentario raíz del hilo.
--
--    EXCLUSIVIDAD: exactamente una FK (articulo_id / resena_id)
--    debe estar rellena — la CHECK constraint lo garantiza.
--
--    EDICIÓN/BORRADO SUAVE: el usuario puede editar su texto
--    (editado = 1) o eliminar en suave (eliminado = 1).
-- ============================================================
CREATE TABLE IF NOT EXISTS comentarios (
    id           INT           NOT NULL AUTO_INCREMENT,
    usuario_id   INT           NOT NULL  COMMENT 'FK a usuarios — quien comenta',
    articulo_id  INT                     COMMENT 'FK a articulos  (NULL si es comentario de reseña)',
    resena_id    INT                     COMMENT 'FK a resenas    (NULL si es comentario de artículo)',
    padre_id     INT                     COMMENT 'FK al comentario padre (NULL = raíz del hilo)',
    contenido    VARCHAR(1000) NOT NULL  COMMENT 'Texto del comentario — máx. 1000 caracteres',
    editado      TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '1 = editado por el usuario',
    eliminado    TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '1 = borrado suave, oculto en UI',
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_comentarios_usuario  (usuario_id),
    INDEX idx_comentarios_articulo (articulo_id),
    INDEX idx_comentarios_resena   (resena_id),
    INDEX idx_comentarios_padre    (padre_id),
    INDEX idx_comentarios_fecha    (created_at),

    -- Garantiza que el comentario pertenezca a exactamente un destino
    CONSTRAINT chk_comentarios_destino CHECK (
        (articulo_id IS NOT NULL AND resena_id IS NULL)
        OR
        (articulo_id IS NULL AND resena_id IS NOT NULL)
    ),

    CONSTRAINT fk_comentarios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_comentarios_articulo
        FOREIGN KEY (articulo_id) REFERENCES articulos (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_comentarios_resena
        FOREIGN KEY (resena_id) REFERENCES resenas (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_comentarios_padre
        FOREIGN KEY (padre_id) REFERENCES comentarios (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Comentarios anidados al pie de artículos y reseñas';


-- ============================================================
-- 8. OPINIONES
--    Usuarios de la comunidad publican su opinión personal
--    sobre un videojuego. Texto corto + puntuación de estrellas.
--    Sección independiente del contenido editorial.
-- ============================================================
CREATE TABLE IF NOT EXISTS opiniones (
    id                INT          NOT NULL AUTO_INCREMENT,
    usuario_id        INT          NOT NULL  COMMENT 'FK a usuarios — autor de la opinión',
    videojuego_id     INT          NOT NULL,
    contenido         VARCHAR(800) NOT NULL  COMMENT 'Opinión personal — máx. 800 caracteres',
    estrellas         TINYINT      NOT NULL  COMMENT 'Valoración de 1 a 5 estrellas',
    editada           TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = editada por el usuario',
    eliminada         TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = borrado suave',
    fecha_publicacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_opiniones_usuario    (usuario_id),
    INDEX idx_opiniones_videojuego (videojuego_id),
    INDEX idx_opiniones_fecha      (fecha_publicacion),

    CONSTRAINT chk_opiniones_estrellas CHECK (estrellas BETWEEN 1 AND 5),

    CONSTRAINT fk_opiniones_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_opiniones_videojuego
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Opiniones personales de usuarios sobre videojuegos';


-- ============================================================
-- 9. OPINION_COMENTARIOS
--    Un usuario comenta la opinión de otro usuario.
--    Un solo nivel — los comentarios no se anidan entre sí.
--    El usuario puede editar o eliminar su propio comentario.
-- ============================================================
CREATE TABLE IF NOT EXISTS opinion_comentarios (
    id         INT          NOT NULL AUTO_INCREMENT,
    opinion_id INT          NOT NULL  COMMENT 'FK a opiniones — opinión que se comenta',
    usuario_id INT          NOT NULL  COMMENT 'FK a usuarios — quien deja el comentario',
    contenido  VARCHAR(600) NOT NULL  COMMENT 'Texto del comentario — máx. 600 caracteres',
    editado    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = editado por el usuario',
    eliminado  TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = borrado suave',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_opcom_opinion (opinion_id),
    INDEX idx_opcom_usuario (usuario_id),
    INDEX idx_opcom_fecha   (created_at),

    CONSTRAINT fk_opcom_opinion
        FOREIGN KEY (opinion_id) REFERENCES opiniones (id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_opcom_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Comentarios de usuarios a opiniones de otros usuarios (1 nivel, sin anidar)';


-- ============================================================
-- 10. DESARROLLADORES
--     Estudios o personas entrevistadas por el portal
-- ============================================================
CREATE TABLE IF NOT EXISTS desarrolladores (
    id          INT          NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(200) NOT NULL  COMMENT 'Nombre del estudio o del desarrollador individual',
    tipo        ENUM('estudio','persona') NOT NULL DEFAULT 'estudio',
    descripcion TEXT                    COMMENT 'Bio o descripción del entrevistado',
    sitio_web   VARCHAR(300)            COMMENT 'URL del sitio oficial',
    pais        VARCHAR(100)            COMMENT 'País de origen',
    imagen      VARCHAR(500)            COMMENT 'Foto o logotipo',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    INDEX idx_desarrolladores_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Estudios y desarrolladores individuales referenciados en entrevistas';


-- ============================================================
-- 11. ENTREVISTAS
--     Entrevistas publicadas por el equipo editorial.
--     Contenido extenso de preguntas y respuestas.
-- ============================================================
CREATE TABLE IF NOT EXISTS entrevistas (
    id                INT          NOT NULL AUTO_INCREMENT,
    desarrollador_id  INT          NOT NULL  COMMENT 'FK a desarrolladores — el entrevistado',
    autor_id          INT          NOT NULL  COMMENT 'FK a usuarios — editor que realizó la entrevista',
    titulo            VARCHAR(300) NOT NULL,
    slug              VARCHAR(320) NOT NULL,
    contenido         LONGTEXT     NOT NULL  COMMENT 'Preguntas y respuestas completas — sin límite',
    imagen_destacada  VARCHAR(500)           COMMENT 'Imagen principal de la entrevista',
    fecha_publicacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_entrevistas_slug      (slug),
    INDEX idx_entrevistas_desarrollador (desarrollador_id),
    INDEX idx_entrevistas_autor         (autor_id),
    INDEX idx_entrevistas_fecha         (fecha_publicacion),

    CONSTRAINT fk_entrevistas_desarrollador
        FOREIGN KEY (desarrollador_id) REFERENCES desarrolladores (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_entrevistas_autor
        FOREIGN KEY (autor_id) REFERENCES usuarios (id_usuario)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Entrevistas a estudios y desarrolladores de videojuegos';


-- ============================================================
-- 12. DESTACADOS_GOTY
--     Nominaciones y ganadores del GOTY por año.
--     También alimenta el bloque de nominados en portada.
-- ============================================================
CREATE TABLE IF NOT EXISTS destacados_goty (
    id            INT          NOT NULL AUTO_INCREMENT,
    videojuego_id INT          NOT NULL,
    anio          YEAR         NOT NULL  COMMENT 'Año de la nominación',
    ganador       TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '1 = ganó el GOTY ese año',
    descripcion   VARCHAR(500)           COMMENT 'Motivo o descripción de la nominación',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_goty_juego_anio (videojuego_id, anio) COMMENT 'Un juego, una nominación por año',
    INDEX idx_goty_anio           (anio),
    INDEX idx_goty_ganador        (ganador),

    CONSTRAINT fk_goty_videojuego
        FOREIGN KEY (videojuego_id) REFERENCES videojuegos (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Nominaciones y ganadores del Game of the Year por año';


-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
-- FIN DEL SCRIPT — ZonaPixel Database Schema v3
-- Tablas creadas: 12 nuevas + 2 preexistentes (roles, usuarios)
-- ============================================================