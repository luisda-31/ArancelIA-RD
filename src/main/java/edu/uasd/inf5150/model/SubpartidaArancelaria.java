package edu.uasd.inf5150.model;

public class SubpartidaArancelaria {
    private String codigoSubpartida;
    private String descripcion;
    private double arancelAdValorem;

    public SubpartidaArancelaria(String codigoSubpartida, String descripcion, double arancelAdValorem) {
        this.codigoSubpartida = codigoSubpartida;
        this.descripcion = descripcion;
        this.arancelAdValorem = arancelAdValorem;
    }

    public String getCodigoSubpartida() { return codigoSubpartida; }
    public String getDescripcion() { return descripcion; }
    public double getArancelAdValorem() { return arancelAdValorem; }
}