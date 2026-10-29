package edu.uasd.inf5150.model;

public class CalculadoraAduanal {
    private double valorCifUsd;
    private double tasaCambio; // Tasa oficial (Ej: 60.00 DOP)
    private PartidaArancelaria partida;

    public CalculadoraAduanal(double valorCifUsd, double tasaCambio, PartidaArancelaria partida) {
        this.valorCifUsd = valorCifUsd;
        this.tasaCambio = tasaCambio;
        this.partida = partida;
    }

    // 1. Convertir Valor CIF a Pesos Dominicanos (DOP)
    public double calcularValorCifDop() {
        return this.valorCifUsd * this.tasaCambio;
    }

    // 2. Calcular Gravamen (Ad-Valorem)
    public double calcularGravamen() {
        return calcularValorCifDop() * (partida.getArancelAdValorem() / 100.0);
    }

    // 3. Calcular Impuesto Selectivo al Consumo (ISC)
    public double calcularIsc() {
        return (calcularValorCifDop() + calcularGravamen()) * (partida.getSelectivoConsumo() / 100.0);
    }

    // 4. Calcular Base Imponible para el ITBIS (CIF + Gravamen + ISC)
    public double calcularBaseItbis() {
        return calcularValorCifDop() + calcularGravamen() + calcularIsc();
    }

    // 5. Calcular Monto del ITBIS (18%)
    public double calcularItbis() {
        return calcularBaseItbis() * (partida.getItbis() / 100.0);
    }

    // 6. Calcular Total de Impuestos a Pagar
    public double calcularTotalImpuestos() {
        return calcularGravamen() + calcularIsc() + calcularItbis();
    }
}