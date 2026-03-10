<?php 
include './usuarioModel.php';

$usuario = consultar_usuarios_rol();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZonaPixel - Gestión de Usuario</title>
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
            <h1 class="page-title">Gestión de Usuario</h1>
            <p class="page-subtitle">Administra todos los usuarios de ZonaPixel</p>
        </div>
    </div>

    <div class="container">
        <div class="crud-container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Lista de Usuarios</h2>
                <button class="btn-add">
                    <i class="fas fa-plus"></i> Nueva Reseña
                </button>
            </div>

            <div class="table-container">
                <table class="custom-table" id="reviewsTable">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Nombre de Usuario</th>
                            <th>Correo Electronico</th>
                            <th>Rol</th>
                            <th>Actividad</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <?php while ($filas = mysqli_fetch_assoc($usuario)): ?>
                            <tr>
                                <td>
                                    <?= $filas['id_usuario'] ?>
                                </td>
                                <td>
                                    <?= $filas['nombre'] ?>
                                </td>
                                <td>
                                    <?= $filas['apellido'] ?>
                                </td>
                                <td>
                                    <?= $filas['nombre_usuario'] ?>
                                </td>
                                <td>
                                    <?= $filas['email'] ?>
                                </td>
                                <td>
                                    <?= 
                                    $id = $filas["nombre_rol"];
                                    ?>
                                </td>

                                <td> 
                                    <a href="./actualizar_usuario.php?id=<?=$filas['id_usuario']?>">Modificar</a>
                                </td>

                                <td> 
                                    <a href="./usuarioModel.php?eliminar=<?= $filas['id_usuario'] ?>">Eliminar</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>

                    </tbody>
                </table>
                <div id="emptyState" class="empty-state" style="display: none;">
                    <i class="fas fa-gamepad"></i>
                    <h4>No hay reseñas todavía</h4>
                    <p>Comienza agregando tu primera reseña</p>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <div class="container text-center">
            <p class="text-muted small mb-0">Copyright © 2025 ZonaPixel - Sistema de Gestión</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/zonapixel_crud.js"></script>
</body>
</html>