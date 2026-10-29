package edu.uasd.inf5150.model;

import java.time.LocalDateTime;

public class HistorialConsulta {
    private int id;
    private String busquedaRealizada;
    private LocalDateTime fechaHora;

    public HistorialConsulta(int id, String busquedaRealizada) {
        this.id = id;
        this.busquedaRealizada = busquedaRealizada;
        this.fechaHora = LocalDateTime.now();
    }

    public int getId() { return id; }
    public String getBusquedaRealizada() { return busquedaRealizada; }
    public LocalDateTime getFechaHora() { return fechaHora; }
}