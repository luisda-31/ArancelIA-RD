package edu.uasd.inf5150;

import edu.uasd.inf5150.model.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== VALIDACIÓN DE MODELO DOMINIO (10 CLASES OOP) ===");

        AgenteAduanas agente = new AgenteAduanas("Luis Rodriguez", "100666336", "j.castillo@dga.gob.do", "EX-2026", "Aduanas RD");
        CapituloArancelario cap85 = new CapituloArancelario(1, "85", "Máquinas, aparatos y material eléctrico");
        TasaCambio tasaUsdDop = new TasaCambio("USD", "DOP", 60.00);
        RequisitoImportacion req = new RequisitoImportacion(false, "No requiere", "Ninguna");

        System.out.println("✅ Agente: " + agente.getNombre() + " (" + agente.getCompania() + ")");
        System.out.println("✅ Capítulo: " + cap85.getCodigo() + " - " + cap85.getDescripcion());
        System.out.println("✅ Tasa de Cambio: 1 " + tasaUsdDop.getMonedaOrigen() + " = " + tasaUsdDop.getValorTasa() + " " + tasaUsdDop.getMonedaDestino());
        System.out.println("✅ Requisito VUCE: " + (req.isRequiereVuce() ? "Sí" : "No"));
        System.out.println("=====================================================");
    }
}