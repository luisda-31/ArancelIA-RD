package edu.uasd.inf5150.model;

public class ReporteLiquidacion {
    private PartidaArancelaria partida;
    private CalculadoraAduanal calculadora;
    private AgenteAduanas agente;

    public ReporteLiquidacion(PartidaArancelaria partida, CalculadoraAduanal calculadora, AgenteAduanas agente) {
        this.partida = partida;
        this.calculadora = calculadora;
        this.agente = agente;
    }

    public PartidaArancelaria getPartida() { return partida; }
    public CalculadoraAduanal getCalculadora() { return calculadora; }
    public AgenteAduanas getAgente() { return agente; }
}