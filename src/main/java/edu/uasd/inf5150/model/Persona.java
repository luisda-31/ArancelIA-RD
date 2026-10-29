package edu.uasd.inf5150.model;

public abstract class Persona {
    private String nombre;
    private String cedulaOrRnc;
    private String correo;

    public Persona(String nombre, String cedulaOrRnc, String correo) {
        this.nombre = nombre;
        this.cedulaOrRnc = cedulaOrRnc;
        this.correo = correo;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCedulaOrRnc() { return cedulaOrRnc; }
    public void setCedulaOrRnc(String cedulaOrRnc) { this.cedulaOrRnc = cedulaOrRnc; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
}