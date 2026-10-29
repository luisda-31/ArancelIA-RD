package edu.uasd.inf5150.model;

public class RequisitoImportacion {
    private boolean requiereVuce;
    private String permisos;
    private String institucionReguladora;

    public RequisitoImportacion(boolean requiereVuce, String permisos, String institucionReguladora) {
        this.requiereVuce = requiereVuce;
        this.permisos = permisos;
        this.institucionReguladora = institucionReguladora;
    }

    public boolean isRequiereVuce() { return requiereVuce; }
    public String getPermisos() { return permisos; }
    public String getInstitucionReguladora() { return institucionReguladora; }
}