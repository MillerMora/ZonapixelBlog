<?php 
include './usuarioModel.php';
$id = $_GET['id'];

$fila = consultar_usuarios_id($id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZonaPixel - Actualizar Usuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-light sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#">
                <img src="https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?semt=ais_hybrid&w=740&q=80" alt="Logo" class="Logo">
                ZonaPixel
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a class="nav-link" href="#"><i class="fas fa-home"></i> Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="#"><i class="fas fa-cog"></i> Gestión</a>
                    </li>
                    <li class="nav-item user-dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="Login.html"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</a></li>
                            <li><a class="dropdown-item" href="Register.html"><i class="fas fa-user-plus"></i> Regístrate</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="page-header">
        <div class="container">
            <h1 class="page-title">Actualizar Usuario</h1>
            <p class="page-subtitle">Modifica los datos del usuario</p>
        </div>
    </div>

    <div class="container">
        <div class="crud-container">
            <div class="mb-4">
                <a href="./usuario.php" class="btn-back">
                    <i class="fas fa-arrow-left"></i> Volver a Usuarios
                </a>
            </div>

            <form id="updateUserForm" action="editar_usuario.php" method="POST">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="id_usuario" class="form-label">id</label>
                        <input type="text" class="form-control" id="id_usuario" name="id_usuario" required value="<?= $fila['id_usuario'] ?>" readonly>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" required value="<?= $fila['nombre'] ?>">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="apellido" class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="apellido" name="apellido" required value="<?= $fila['apellido'] ?>">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nombre_usuario" class="form-label">Nombre de Usuario</label>
                        <input type="text" class="form-control" id="nombre_usuario" name="usuario_nombre" required value="<?= $fila['nombre_usuario'] ?>">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input type="email" class="form-control" id="email" name="email" required value="<?= $fila['email'] ?>">
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="password" name="password" required value="<?= $fila['password_hash'] ?>">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="id_rol" class="form-label">Rol</label>
                    <select class="form-select" id="id_rol" name="id_rol" required>
                        <option value="1" <?php if ($fila['id_rol'] == 1) echo "selected"; ?>>Administrador</option>
                        <option value="2" <?php if ($fila['id_rol'] == 2) echo "selected"; ?>>Usuario</option>
                    </select>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn-save">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <a href="./usuario.php" class="btn-cancel">
                        Cancelar
                    </a>
                </div>
            </form>
        </div>
    </div>

    <footer>
        <div class="container text-center">
            <p class="text-muted small mb-0">Copyright © 2025 ZonaPixel - Sistema de Gestión</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

