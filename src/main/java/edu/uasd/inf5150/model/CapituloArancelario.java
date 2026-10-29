package edu.uasd.inf5150.model;

public class CapituloArancelario {
    private int id;
    private String codigo;
    private String descripcion;

    public CapituloArancelario(int id, String codigo, String descripcion) {
        this.id = id;
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

    public int getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getDescripcion() { return descripcion; }
}