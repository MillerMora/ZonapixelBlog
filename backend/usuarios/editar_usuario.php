<?php
include "./usuarioModel.php";

$id = $_POST['id_usuario'];
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$usuario = $_POST['usuario_nombre'];
$correo = $_POST['email'];
$contrasena = $_POST['password'];
$id_rol = $_POST['id_rol'];

$x = actualizar_usuario($id, $nombre, $apellido, $usuario, $correo, $contrasena, $id_rol);

if ($x) {
    header('Location: usuario.php');
    exit;
} else {
    echo "Error al actualizar el usuario";
}
?>

