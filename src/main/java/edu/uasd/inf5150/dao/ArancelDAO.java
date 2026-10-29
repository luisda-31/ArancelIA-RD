package edu.uasd.inf5150.dao;

import edu.uasd.inf5150.model.PartidaArancelaria;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ArancelDAO {

    // Método para buscar subpartidas por código o descripción en SQL Server
    public List<PartidaArancelaria> buscarPartidas(String criterio) {
        List<PartidaArancelaria> lista = new ArrayList<>();
        String sql = "SELECT * FROM subpartidas WHERE codigo_arancelario LIKE ? OR descripcion LIKE ?";

        try (Connection conn = ConexionDB.obtenerConexion();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, "%" + criterio + "%");
            stmt.setString(2, "%" + criterio + "%");

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                PartidaArancelaria partida = new PartidaArancelaria(
                        rs.getInt("id"),
                        rs.getString("codigo_arancelario"),
                        rs.getString("descripcion"),
                        rs.getString("unidad_fisica"),
                        rs.getDouble("arancel_advalorem"),
                        rs.getDouble("itbis"),
                        rs.getDouble("selectivo_consumo"),
                        rs.getBoolean("requiere_vuce"),
                        rs.getString("permisos_importacion"),
                        rs.getString("institucion_reguladora"),
                        rs.getString("observaciones")
                );
                lista.add(partida);
            }
        } catch (SQLException e) {
            System.err.println("Error al consultar la base de datos: " + e.getMessage());
        }
        return lista;
    }
}