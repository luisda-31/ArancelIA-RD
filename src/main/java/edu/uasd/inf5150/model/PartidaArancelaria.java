package edu.uasd.inf5150.model;

public class PartidaArancelaria {
    private int id;
    private String codigoSubpartida;
    private String descripcion;
    private String unidadFisica;
    private double arancelAdValorem;
    private double itbis;
    private double selectivoConsumo;
    private boolean requiereVuce;
    private String permisosImportacion;
    private String institucionReguladora;
    private String observaciones;

    // Constructor completo para inicializar los datos de la DGA
    public PartidaArancelaria(int id, String codigoSubpartida, String descripcion, String unidadFisica,
                              double arancelAdValorem, double itbis, double selectivoConsumo,
                              boolean requiereVuce, String permisosImportacion, String institucionReguladora, String observaciones) {
        this.id = id;
        this.codigoSubpartida = codigoSubpartida;
        this.descripcion = descripcion;
        this.unidadFisica = unidadFisica;
        this.arancelAdValorem = arancelAdValorem;
        this.itbis = itbis;
        this.selectivoConsumo = selectivoConsumo;
        this.requiereVuce = requiereVuce;
        this.permisosImportacion = permisosImportacion;
        this.institucionReguladora = institucionReguladora;
        this.observaciones = observaciones;
    }

    // Métodos Accesorios (Getters - Encapsulamiento)
    public int getId() { return id; }
    public String getCodigoSubpartida() { return codigoSubpartida; }
    public String getDescripcion() { return descripcion; }
    public String getUnidadFisica() { return unidadFisica; }
    public double getArancelAdValorem() { return arancelAdValorem; }
    public double getItbis() { return itbis; }
    public double getSelectivoConsumo() { return selectivoConsumo; }
    public boolean isRequiereVuce() { return requiereVuce; }
    public String getPermisosImportacion() { return permisosImportacion; }
    public String getInstitucionReguladora() { return institucionReguladora; }
    public String getObservaciones() { return observaciones; }
}