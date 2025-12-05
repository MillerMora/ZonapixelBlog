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

INSERT INTO usuarios (nombre_usuario, email, password_hash, id_rol) VALUES
('admin', 'admin@zonapixel.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    imagen_categoria VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Acción', 'Juegos de acción y aventura'),
('RPG', 'Juegos de rol'),
('Estrategia', 'Juegos de estrategia'),
('Deportes', 'Juegos deportivos'),
('Simulación', 'Juegos de simulación'),
('Aventura', 'Juegos de aventura'),
('Terror', 'Juegos de terror'),
('Multijugador', 'Juegos multijugador');

CREATE TABLE IF NOT EXISTS juegos (
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
);

CREATE TABLE IF NOT EXISTS articulos (
    id_articulo INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_juego INT,
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_articulos_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_articulos_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    CONSTRAINT FK_articulos_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL,
    INDEX idx_titulo (titulo),
    INDEX idx_fecha_publicacion (fecha_publicacion)
);

CREATE TABLE IF NOT EXISTS resenas (
    id_resena INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
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
    CONSTRAINT FK_resenas_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_resenas_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    CONSTRAINT FK_resenas_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego),
    INDEX idx_titulo_resenas (titulo),
    INDEX idx_fecha_publicacion_resenas (fecha_publicacion),
    INDEX idx_calificacion_general (calificacion_general)
);

CREATE TABLE IF NOT EXISTS entrevistas (
    id_entrevista INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
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
    CONSTRAINT FK_entrevistas_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_entrevistas_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    INDEX idx_titulo_entrevistas (titulo),
    INDEX idx_fecha_publicacion_entrevistas (fecha_publicacion)
);

CREATE TABLE IF NOT EXISTS opiniones (
    id_opinion INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_juego INT,
    calificacion_estrellas INT CHECK (calificacion_estrellas >= 1 AND calificacion_estrellas <= 5),
    imagen_principal VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    vistas INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_opiniones_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_opiniones_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL,
    CONSTRAINT FK_opiniones_juegos FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE SET NULL,
    INDEX idx_titulo_opiniones (titulo),
    INDEX idx_fecha_publicacion_opiniones (fecha_publicacion),
    INDEX idx_autor (id_autor)
);

CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    id_opinion INT NOT NULL,
    id_autor INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_comentarios_opiniones FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
    CONSTRAINT FK_comentarios_usuarios FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario),
    INDEX idx_opinion (id_opinion),
    INDEX idx_fecha_publicacion_comentarios (fecha_publicacion)
);

CREATE TABLE IF NOT EXISTS calificaciones_opiniones (
    id_calificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_opinion INT NOT NULL,
    id_usuario INT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_calificaciones_opiniones FOREIGN KEY (id_opinion) REFERENCES opiniones(id_opinion) ON DELETE CASCADE,
    CONSTRAINT FK_calificaciones_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT unique_calificacion UNIQUE (id_opinion, id_usuario),
    INDEX idx_opinion_calificaciones (id_opinion)
);

CREATE TABLE IF NOT EXISTS imagenes (
    id_imagen INT PRIMARY KEY AUTO_INCREMENT,
    tipo_contenido VARCHAR(20) NOT NULL CHECK (tipo_contenido IN ('articulo', 'resena', 'entrevista', 'opinion', 'proyecto')),
    id_contenido INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    orden INT DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contenido (tipo_contenido, id_contenido)
);

CREATE OR REPLACE VIEW vista_opiniones_calificadas AS
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
GROUP BY 
    o.id_opinion, o.titulo, o.contenido, o.id_autor, o.id_categoria, o.id_juego,
    o.calificacion_estrellas, o.imagen_principal, o.fecha_publicacion, 
    o.fecha_modificacion, o.vistas, o.activo,
    u.nombre_usuario, u.imagen_perfil, c.nombre_categoria, j.nombre_juego;

CREATE OR REPLACE VIEW vista_resenas_completas AS
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

DELIMITER //

CREATE PROCEDURE estadisticas_usuario(
    IN p_id_usuario INT
)
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
END//

DELIMITER ;

INSERT INTO juegos (nombre_juego, descripcion, desarrollador, fecha_lanzamiento, plataformas, imagen_portada, activo) VALUES
('The Last of Us Part II', 'Juego de acción y aventura en un mundo postapocalíptico donde Ellie busca venganza', 'Naughty Dog', '2020-06-19', 'PlayStation 4, PlayStation 5', 'tlou2.jpg', TRUE),
('Elden Ring', 'RPG de acción y mundo abierto creado por FromSoftware y George R.R. Martin', 'FromSoftware', '2022-02-25', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S', 'eldenring.jpg', TRUE),
('God of War Ragnarök', 'Continuación de la saga de Kratos y Atreus en la mitología nórdica', 'Santa Monica Studio', '2022-11-09', 'PlayStation 4, PlayStation 5', 'gowr.jpg', TRUE),
('Hogwarts Legacy', 'RPG de mundo abierto ambientado en el universo de Harry Potter en el siglo XIX', 'Avalanche Software', '2023-02-10', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S, Nintendo Switch', 'hogwarts.jpg', TRUE),
('Resident Evil 4 Remake', 'Remake del clásico juego de terror y supervivencia', 'Capcom', '2023-03-24', 'PC, PlayStation 4, PlayStation 5, Xbox Series X/S', 're4remake.jpg', TRUE),
('Baldur''s Gate 3', 'RPG de rol y estrategia basado en Dungeons & Dragons', 'Larian Studios', '2023-08-03', 'PC, PlayStation 5, Xbox Series X/S', 'bg3.jpg', TRUE),
('The Legend of Zelda: Tears of the Kingdom', 'Secuela de Breath of the Wild con nuevas mecánicas y exploración aérea', 'Nintendo', '2023-05-12', 'Nintendo Switch', 'totk.jpg', TRUE),
('Spider-Man 2', 'Aventura de superhéroes donde controlas a Peter Parker y Miles Morales', 'Insomniac Games', '2023-10-20', 'PlayStation 5', 'spiderman2.jpg', TRUE),
('Starfield', 'RPG de ciencia ficción y exploración espacial', 'Bethesda Game Studios', '2023-09-06', 'PC, Xbox Series X/S', 'starfield.jpg', TRUE),
('Alan Wake 2', 'Survival horror psicológico y secuela del juego original', 'Remedy Entertainment', '2023-10-27', 'PC, PlayStation 5, Xbox Series X/S', 'alanwake2.jpg', TRUE),
('Cyberpunk 2077', 'RPG de mundo abierto en una ciudad futurista distópica', 'CD Projekt Red', '2020-12-10', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S', 'cyberpunk.jpg', TRUE),
('FIFA 24', 'Simulador de fútbol con licencias oficiales', 'EA Sports', '2023-09-29', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S, Nintendo Switch', 'fifa24.jpg', TRUE),
('Call of Duty: Modern Warfare III', 'Shooter en primera persona de la icónica franquicia', 'Sledgehammer Games', '2023-11-10', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S', 'mw3.jpg', TRUE),
('Assassin''s Creed Mirage', 'Retorno a las raíces de la saga en Bagdad del siglo IX', 'Ubisoft', '2023-10-05', 'PC, PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S', 'acmirage.jpg', TRUE),
('Mortal Kombat 1', 'Reinicio de la saga de peleas con nueva línea temporal', 'NetherRealm Studios', '2023-09-19', 'PC, PlayStation 5, Xbox Series X/S, Nintendo Switch', 'mk1.jpg', TRUE);

INSERT INTO articulos (titulo, contenido, id_autor, id_categoria, id_juego, imagen_principal, vistas, activo) VALUES
('El Futuro de los Videojuegos en 2024', 'Los videojuegos han evolucionado enormemente en las últimas décadas. En 2024, la industria continúa su expansión con tecnologías como ray tracing en tiempo real, inteligencia artificial avanzada y realidad virtual más inmersiva. Los desarrolladores están apostando por experiencias más narrativas y mundos abiertos cada vez más detallados.', 1, 1, NULL, 'futuro2024.jpg', 1250, TRUE),
('Top 10 RPGs que Debes Jugar', 'Los juegos de rol han capturado la imaginación de millones de jugadores. Desde clásicos como Final Fantasy hasta innovaciones modernas como Baldur''s Gate 3, el género RPG ofrece experiencias inolvidables con historias profundas, desarrollo de personajes y decisiones que impactan el mundo del juego.', 1, 2, NULL, 'top10rpg.jpg', 2100, TRUE),
('Guía Completa de Elden Ring para Principiantes', 'Elden Ring puede ser intimidante para nuevos jugadores. Esta guía cubre los conceptos básicos: cómo elegir tu clase inicial, las mejores rutas para explorar Limgrave, consejos para derrotar a Margit y cómo optimizar tu build en las primeras horas de juego.', 1, 2, 2, 'guiaelden.jpg', 3500, TRUE),
('La Evolución del Terror en Resident Evil', 'Resident Evil ha definido el género de survival horror durante décadas. Desde las mansiones claustrofóbicas de los juegos originales hasta los escenarios más abiertos de las entregas modernas, la franquicia ha sabido reinventarse manteniendo la esencia del terror y la tensión.', 1, 7, 5, 'evolutionre.jpg', 1890, TRUE),
('¿Vale la Pena Hogwarts Legacy en 2024?', 'Hogwarts Legacy permitió a los fans explorar el mundo mágico como nunca antes. Un año después de su lanzamiento, analizamos si el juego sigue valiendo la pena, considerando las actualizaciones, el contenido adicional y la comunidad activa de jugadores.', 1, 6, 4, 'hogwarts2024.jpg', 2700, TRUE);

INSERT INTO resenas (titulo, contenido, id_autor, id_categoria, id_juego, calificacion_grafica, calificacion_gameplay, calificacion_sonido, calificacion_general, imagen_principal, vistas, activo) VALUES
('Baldur''s Gate 3: Una Obra Maestra del RPG', 'Baldur''s Gate 3 de Larian Studios es posiblemente el mejor RPG de la década. Con una historia ramificada que responde genuinamente a tus decisiones, combate táctico profundo basado en D&D 5e, y personajes memorables con sus propias motivaciones y arcos narrativos. Los gráficos son impresionantes, especialmente las cinemáticas y animaciones faciales. El diseño de sonido y la banda sonora orquestal complementan perfectamente cada momento épico. Es un juego que respeta tu tiempo y decisiones, ofreciendo múltiples caminos y finales. Una experiencia imprescindible para cualquier fan del género.', 1, 2, 6, 9.5, 10.0, 9.0, 9.5, 'reviewbg3.jpg', 4200, TRUE),
('The Legend of Zelda: Tears of the Kingdom - Innovación Pura', 'Nintendo ha superado las altísimas expectativas con Tears of the Kingdom. El juego expande el mundo de Breath of the Wild añadiendo islas flotantes en el cielo y cavernas subterráneas, triplicando efectivamente el área jugable. Las nuevas mecánicas de construcción permiten creatividad ilimitada, desde vehículos hasta máquinas complejas. Los puzzles de los santuarios son ingeniosos y variados. Gráficamente impresionante considerando el hardware de Switch, con una dirección artística sublime. La música es emotiva y memorable. Link''s aventura es épica en escala pero íntima en momentos clave. Un logro extraordinario en diseño de juegos.', 1, 6, 7, 8.5, 10.0, 9.5, 9.5, 'reviewtotk.jpg', 5100, TRUE),
('Resident Evil 4 Remake: Terror Renovado', 'Capcom demuestra una vez más su maestría en remakes. RE4 Remake mantiene la esencia del clásico mientras moderniza cada aspecto. Los gráficos con RE Engine son espectaculares, creando atmósferas aterradoras en el pueblo y el castillo. El combate se siente más tenso y táctico. Ashley es un personaje mucho más desarrollado. Leon conserva su carisma pero con una actuación más madura. El sonido ambiental genera tensión constante. Algunos cambios en el ritmo pueden dividir a los puristas, pero el resultado es un survival horror excepcional que funciona tanto para veteranos como nuevos jugadores. Un remake ejemplar.', 1, 7, 5, 9.5, 9.0, 9.5, 9.5, 'reviewre4.jpg', 3800, TRUE),
('Spider-Man 2: Dobla la Diversión', 'Insomniac entrega una secuela que mejora todo del original. Controlar a Peter y Miles, cada uno con habilidades únicas, mantiene el gameplay fresco. El traje simbiótico añade nuevas mecánicas de combate brutales. Nueva York está más viva que nunca, con más actividades secundarias significativas. La historia aborda temas maduros de responsabilidad y redención. Queens y Brooklyn amplían el mapa considerablemente. Gráficamente es un showcase del PS5, especialmente con ray tracing. El web-swinging sigue siendo la mejor mecánica de traversal en videojuegos. Venom es un antagonista intimidante. Algunas misiones pueden sentirse repetitivas, pero la experiencia general es fantástica.', 1, 1, 8, 9.5, 9.5, 9.0, 9.5, 'reviewspider2.jpg', 4500, TRUE),
('Starfield: Ambición Espacial con Altibajos', 'El primer nuevo universo de Bethesda en 25 años es ambicioso pero desigual. La exploración espacial de mil planetas suena impresionante, pero muchos se sienten procedurales y vacíos. La historia principal es interesante con buenos giros, pero las misiones secundarias varían en calidad. El combate espacial es divertido, el sistema de construcción de naves robusto. Gráficamente decente pero no revolucionario, con problemas de rendimiento en PC. El rol-playing ofrece muchas opciones de personalización. La música de Inon Zur es épica. Es un juego que brillará más con mods de la comunidad. Tiene potencial pero necesita refinamiento.', 1, 2, 9, 7.5, 7.0, 8.5, 7.5, 'reviewstarfield.jpg', 2900, TRUE);

INSERT INTO entrevistas (titulo, contenido, id_autor, id_categoria, entrevistado, cargo_entrevistado, video_url, imagen_principal, vistas, activo) VALUES
('Entrevista con Hidetaka Miyazaki sobre Elden Ring', 'Tuvimos la oportunidad de hablar con Hidetaka Miyazaki, director de Elden Ring, sobre el proceso creativo detrás del juego. Miyazaki compartió cómo la colaboración con George R.R. Martin enriqueció la narrativa del mundo: "Martin creó la mitología y el trasfondo, lo que nos dio una base sólida para construir las historias que los jugadores experimentan directamente". Discutimos el diseño de mundo abierto, los desafíos de balancear dificultad con accesibilidad, y por qué decidieron incluir invocaciones de espíritus. Miyazaki también habló sobre el futuro de FromSoftware y posibles expansiones para Elden Ring.', 1, 2, 'Hidetaka Miyazaki', 'Director de Elden Ring - FromSoftware', 'https://youtube.com/watch?v=example1', 'miyazaki.jpg', 6200, TRUE),
('Neil Druckmann habla sobre el Futuro de Naughty Dog', 'Neil Druckmann, vicepresidente de Naughty Dog, nos dio una entrevista exclusiva sobre los proyectos futuros del estudio. Sin revelar títulos específicos, Druckmann mencionó: "Estamos explorando nuevas IPs mientras honramos nuestras franquicias establecidas. La narrativa siempre será nuestro pilar". Hablamos sobre las lecciones aprendidas de The Last of Us Part II, la adaptación de HBO, el proceso de desarrollo durante la pandemia, y su visión sobre cómo la IA generativa podría impactar el desarrollo de juegos. Una conversación fascinante con uno de los narradores más importantes de la industria.', 1, 1, 'Neil Druckmann', 'Vicepresidente - Naughty Dog', 'https://youtube.com/watch?v=example2', 'druckmann.jpg', 5400, TRUE),
('Todd Howard sobre los Aprendizajes de Starfield', 'Todd Howard, director de Bethesda Game Studios, reflexiona sobre el lanzamiento de Starfield: "Entendemos que no todos quedaron satisfechos con ciertos aspectos. Estamos comprometidos a mejorar la experiencia a través de actualizaciones". Discutimos el feedback de la comunidad, los planes para el DLC "Shattered Space", y cómo el motor Creation Engine 2 evolucionará. Howard también habló sobre The Elder Scrolls VI, confirmando que el proyecto está en pre-producción activa. Además, tocamos el tema del modding y por qué Bethesda valora tanto a su comunidad de creadores.', 1, 2, 'Todd Howard', 'Director - Bethesda Game Studios', 'https://youtube.com/watch?v=example3', 'howard.jpg', 4100, TRUE);

INSERT INTO opiniones (titulo, contenido, id_autor, id_categoria, id_juego, calificacion_estrellas, imagen_principal, vistas, activo) VALUES
('Elden Ring cambió mi percepción de los videojuegos', 'Nunca había sido fan de los Souls-like. Me parecían demasiado difíciles y frustrantes. Pero Elden Ring me enganchó desde el primer momento. La libertad de exploración me permitió alejarme de jefes difíciles y volver cuando estaba más preparado. El mundo es absolutamente hermoso y cada rincón esconde algo interesante. Sí, morí muchas veces, pero cada muerte se sintió como una lección. Tras 120 horas y platinar el juego, puedo decir que es mi juego favorito de todos los tiempos. FromSoftware creó una obra maestra.', 1, 2, 2, 5, 'opelden1.jpg', 890, TRUE),
('Tears of the Kingdom: ¿Demasiado grande?', 'Amo Zelda, pero TOTK me abrumó un poco. Hay TANTO que hacer que a veces me sentía perdido. Las mecánicas de construcción son geniales pero a veces solo quería avanzar la historia sin pasar 20 minutos construyendo un vehículo. Los santuarios son excelentes y las mazmorras principales están bien, pero extraño las mazmorras tradicionales más largas. Dicho esto, es un juego increíble con cientos de horas de contenido. Solo desearía que fuera un poco más enfocado. Aún así, fácilmente un 4/5 para mí.', 1, 6, 7, 4, 'opzelda1.jpg', 654, TRUE),
('Spider-Man 2 es pura diversión', 'A veces solo quieres un juego que sea pura diversión sin complicaciones, y Spider-Man 2 es exactamente eso. El web-swinging es adictivo, el combate es satisfactorio, y la historia tiene grandes momentos aunque sea predecible. Peter y Miles tienen buena química. Las misiones secundarias son mejores que en el primero. El traje simbiótico es genial de usar. Lo platine en una semana porque no podía dejar de jugar. No reinventa la rueda, pero perfecciona la fórmula. Altamente recomendado.', 1, 1, 8, 5, 'opspider1.jpg', 721, TRUE),
('Baldur''s Gate 3 es intimidante pero vale la pena', 'Nunca había jugado D&D ni los juegos antiguos de Baldur''s Gate. Al principio me sentí totalmente perdido con todas las estadísticas, habilidades y opciones de combate. Pero después de unas horas algo hizo click. Ahora entiendo por qué todos adoran este juego. Las decisiones realmente importan, los compañeros son personajes complejos con sus propias agendas, y la cantidad de formas de resolver problemas es asombrosa. Voy por mi acto 2 con 60 horas y apenas siento que he arañado la superficie. Si te gusta el rol, este es tu juego.', 1, 2, 6, 5, 'opbg3_1.jpg', 1120, TRUE),
('Cyberpunk 2077 finalmente es el juego que debió ser', 'Compré Cyberpunk al lanzamiento y fue un desastre técnico. Lo dejé frustrado. Tres años después, con la actualización 2.0 y Phantom Liberty, decidí darle otra oportunidad. Wow, qué diferencia. El juego ahora funciona increíblemente bien, la IA policial fue rediseñada, el sistema de perks es mejor, y Night City se siente vivo. La historia siempre fue buena, pero ahora puedo disfrutarla sin bugs constantes. Si lo dejaste en 2020, dale otra oportunidad. CD Projekt Red redimió este juego.', 1, 1, 11, 5, 'opcyber1.jpg', 967, TRUE);

INSERT INTO comentarios (id_opinion, id_autor, contenido, activo) VALUES
(1, 1, 'Totalmente de acuerdo. Elden Ring es especial porque respeta tu tiempo y te deja jugar a tu manera. Los Souls tradicionales son más lineales.', TRUE),
(1, 1, 'Me pasó lo mismo. Lo intenté con Dark Souls 3 y lo dejé. Elden Ring me dio la libertad que necesitaba para engancharme al género.', TRUE),
(2, 1, 'Entiendo tu punto. A veces el juego da demasiadas opciones y puede ser abrumador. Pero personalmente amo esa libertad.', TRUE),
(3, 1, '¡Exacto! No todo juego necesita ser revolucionario. A veces solo quieres columpiarte por NYC y patear traseros.', TRUE),
(4, 1, 'Te recomiendo ver alguna guía básica de D&D 5e en YouTube. Te ayudará mucho a entender las mecánicas del juego.', TRUE),
(5, 1, 'CD Projekt mostró cómo se debe manejar un lanzamiento desastroso. No abandonaron el juego y lo arreglaron. Respeto total.', TRUE),
(5, 1, 'Phantom Liberty es fenomenal. La historia de espionaje es increíble y Idris Elba está genial como Solomon Reed.', TRUE);

INSERT INTO calificaciones_opiniones (id_opinion, id_usuario, calificacion, fecha_calificacion) VALUES
(1, 1, 5, CURRENT_TIMESTAMP),
(2, 1, 4, CURRENT_TIMESTAMP),
(3, 1, 5, CURRENT_TIMESTAMP),
(4, 1, 5, CURRENT_TIMESTAMP),
(5, 1, 5, CURRENT_TIMESTAMP);

INSERT INTO imagenes (tipo_contenido, id_contenido, url_imagen, descripcion, orden) VALUES
('articulo', 1, 'img1_futuro.jpg', 'Concepto de realidad virtual avanzada', 1),
('articulo', 1, 'img2_futuro.jpg', 'Ray tracing en acción', 2),
('articulo', 3, 'limgrave.jpg', 'Vista panorámica de Limgrave', 1),
('articulo', 3, 'margit.jpg', 'Combate contra Margit', 2),
('resena', 1, 'bg3_combat.jpg', 'Sistema de combate táctico', 1),
('resena', 1, 'bg3_companions.jpg', 'Compañeros de aventura', 2),
('resena', 2, 'totk_sky.jpg', 'Islas flotantes', 1),
('resena', 2, 'totk_building.jpg', 'Mecánicas de construcción', 2),
('resena', 3, 're4_village.jpg', 'El pueblo terrorífico', 1),
('opinion', 1, 'elden_boss.jpg', 'Batalla épica contra jefe', 1),
('opinion', 3, 'spider_swing.jpg', 'Columpiándose por NYC', 1);