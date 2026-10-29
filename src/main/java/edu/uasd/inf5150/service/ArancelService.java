package edu.uasd.inf5150.service;

import edu.uasd.inf5150.dao.ArancelDAO;
import edu.uasd.inf5150.model.CalculadoraAduanal;
import edu.uasd.inf5150.model.PartidaArancelaria;

import java.util.List;

public class ArancelService {
    private ArancelDAO arancelDAO;

    public ArancelService() {
        this.arancelDAO = new ArancelDAO();
    }

    // 1. Servicio de Búsqueda Inteligente
    public List<PartidaArancelaria> buscarMercancia(String criterio) {
        return arancelDAO.buscarPartidas(criterio);
    }

    // 2. Servicio de Liquidación Aduanera (Cálculo exacto del MVP)
    public void calcularYMostrarImpuestos(PartidaArancelaria partida, double valorCifUsd, double tasaCambio) {
        CalculadoraAduanal calc = new CalculadoraAduanal(valorCifUsd, tasaCambio, partida);

        System.out.println("\n==================================================");
        System.out.println("          ARANCELIA RD - LIQUIDACIÓN MVP          ");
        System.out.println("==================================================");
        System.out.println("Partida Seleccionada: " + partida.getCodigoSubpartida() + " - " + partida.getDescripcion());
        System.out.println("Valor CIF (USD):      US$ " + String.format("%,.2f", valorCifUsd));
        System.out.println("Valor CIF (DOP):      RD$ " + String.format("%,.2f", calc.calcularValorCifDop()));
        System.out.println("------------------------------------------------==");
        System.out.println("IMPUESTOS ESTIMADOS:");
        System.out.println(" - Gravamen (" + partida.getArancelAdValorem() + "%):          RD$ " + String.format("%,.2f", calc.calcularGravamen()));
        System.out.println(" - Selectivo al Consumo (" + partida.getSelectivoConsumo() + "%): RD$ " + String.format("%,.2f", calc.calcularIsc()));
        System.out.println(" - Base Imponible ITBIS:   RD$ " + String.format("%,.2f", calc.calcularBaseItbis()));
        System.out.println(" - ITBIS (" + partida.getItbis() + "%):             RD$ " + String.format("%,.2f", calc.calcularItbis()));
        System.out.println("------------------------------------------------==");
        System.out.println("TOTAL IMPUESTOS:      RD$ " + String.format("%,.2f", calc.calcularTotalImpuestos()));
        System.out.println("==================================================");
        System.out.println("REQUISITOS DE IMPORTACIÓN:");
        System.out.println(" ¿Requiere VUCE?:     " + (partida.isRequiereVuce() ? "Sí requiere" : "No requiere"));
        System.out.println(" Permisos:            " + partida.getPermisosImportacion());
        System.out.println(" Inst. Reguladora:    " + partida.getInstitucionReguladora());
        System.out.println(" Observaciones:       " + partida.getObservaciones());
        System.out.println("==================================================");
    }
}