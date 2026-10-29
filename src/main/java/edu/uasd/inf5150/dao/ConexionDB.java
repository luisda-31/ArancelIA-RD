package edu.uasd.inf5150.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionDB {
    // Parámetros de conexión a SQL Server Express en tu máquina local
    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=arancelia_db;encrypt=true;trustServerCertificate=true;";
    private static final String USER = "sa"; // Cambia por tu usuario de SQL Server si es distinto
    private static final String PASSWORD = "Margot0931"; // Coloca tu contraseña real de SQL Server

    public static Connection obtenerConexion() {
        try {
            // Cargar el driver JDBC que agregamos en el pom.xml
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            Connection conexion = DriverManager.getConnection(URL, USER, PASSWORD);
            return conexion;
        } catch (ClassNotFoundException e) {
            System.err.println("Error: No se encontró el Driver JDBC de SQL Server. " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Error de conexión a la base de datos: " + e.getMessage());
        }
        return null;
    }
}