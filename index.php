<?php
session_start();

if (isset($_SESSION['id'])) {
    $rol = $_SESSION['rol'];

    switch ($rol) {
        case 'docente':
            header("Location: Cuentas-Docentes/Cuentas-Docentes-Vista.php");
            break;
        case 'financiero':
            header("Location: Cuentas-De-Cobro/Cuentas-De-Cobro-Vista.php");
            break;
        case 'admin':
        default:
            header("Location: Dashboard/Dashboard.php");
            break;
    }
    exit();
} else {
    // No autenticado
    header("Location: Login/Login-Vista.php");
    exit();
}
