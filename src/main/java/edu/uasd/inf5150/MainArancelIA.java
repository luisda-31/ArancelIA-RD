package edu.uasd.inf5150;

import edu.uasd.inf5150.controller.ArancelController;

public class MainArancelIA {
    public static void main(String[] args) {
        try {
            System.out.println("==================================================");
            System.out.println("   INICIANDO BACKEND REST API - ARANCELIA RD      ");
            System.out.println("==================================================");

            // Inicia el servidor en el puerto 8080
            ArancelController.iniciarServidor(8080);

        } catch (Exception e) {
            System.err.println("❌ Error al iniciar el servidor REST: " + e.getMessage());
        }
    }
}