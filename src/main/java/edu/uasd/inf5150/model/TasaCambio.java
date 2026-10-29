package edu.uasd.inf5150.model;

public class TasaCambio {
    private String monedaOrigen;
    private String monedaDestino;
    private double valorTasa;

    public TasaCambio(String monedaOrigen, String monedaDestino, double valorTasa) {
        this.monedaOrigen = monedaOrigen;
        this.monedaDestino = monedaDestino;
        this.valorTasa = valorTasa;
    }

    public String getMonedaOrigen() { return monedaOrigen; }
    public String getMonedaDestino() { return monedaDestino; }
    public double getValorTasa() { return valorTasa; }
}