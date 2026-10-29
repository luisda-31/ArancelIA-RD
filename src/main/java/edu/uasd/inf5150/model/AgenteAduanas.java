package edu.uasd.inf5150.model;

public class AgenteAduanas extends Persona {
    private String numeroExequatur;
    private String compania;

    public AgenteAduanas(String nombre, String cedulaOrRnc, String correo, String numeroExequatur, String compania) {
        super(nombre, cedulaOrRnc, correo);
        this.numeroExequatur = numeroExequatur;
        this.compania = compania;
    }

    public String getNumeroExequatur() { return numeroExequatur; }
    public void setNumeroExequatur(String numeroExequatur) { this.numeroExequatur = numeroExequatur; }
    public String getCompania() { return compania; }
    public void setCompania(String compania) { this.compania = compania; }
}