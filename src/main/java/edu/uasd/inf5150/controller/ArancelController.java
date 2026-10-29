package edu.uasd.inf5150.controller;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import edu.uasd.inf5150.model.CalculadoraAduanal;
import edu.uasd.inf5150.model.PartidaArancelaria;
import edu.uasd.inf5150.service.ArancelService;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class ArancelController {

    private static ArancelService arancelService = new ArancelService();

    public static void iniciarServidor(int puerto) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(puerto), 0);

        // 1. Endpoint de Búsqueda Inteligente (/api/buscar?q=...)
        server.createContext("/api/buscar", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                configurarCors(exchange);
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String query = exchange.getRequestURI().getQuery();
                    String criterio = "";
                    if (query != null && query.contains("q=")) {
                        criterio = query.split("q=")[1].split("&")[0];
                        // Decodificar espacios si los hubiera
                        criterio = java.net.URLDecoder.decode(criterio, StandardCharsets.UTF_8);
                    }

                    List<PartidaArancelaria> lista = arancelService.buscarMercancia(criterio);

                    // Construcción manual de JSON con datos reales institucionales (INDOTEL, DIGEMAPS, etc.)
                    StringBuilder json = new StringBuilder("[");
                    for (int i = 0; i < lista.size(); i++) {
                        PartidaArancelaria p = lista.get(i);
                        json.append(String.format(
                                "{\"id\":%d, \"codigoSubpartida\":\"%s\", \"descripcion\":\"%s\", \"arancelAdValorem\":%.2f, \"itbis\":%.2f, \"selectivoConsumo\":%.2f, \"requiereVuce\":%b, \"permisos\":\"%s\", \"institucion\":\"%s\", \"observaciones\":\"%s\"}",
                                p.getId(),
                                p.getCodigoSubpartida(),
                                p.getDescripcion(),
                                p.getArancelAdValorem(),
                                p.getItbis(),
                                p.getSelectivoConsumo(),
                                p.isRequiereVuce(),
                                escapeJson(p.getPermisosImportacion()),
                                escapeJson(p.getInstitucionReguladora()),
                                escapeJson(p.getObservaciones())
                        ));
                        if (i < lista.size() - 1) json.append(",");
                    }
                    json.append("]");

                    enviarRespuesta(exchange, 200, json.toString());
                } else {
                    enviarRespuesta(exchange, 405, "{\"error\":\"Método no permitido\"}");
                }
            }
        });

        // 2. Endpoint de Cálculo de Tributos Aduanales (/api/calcular?cif=1200&tasa=60)
        server.createContext("/api/calcular", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                configurarCors(exchange);
                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String query = exchange.getRequestURI().getQuery();
                    double cif = 1200.0;
                    double tasa = 60.0;

                    if (query != null) {
                        for (String param : query.split("&")) {
                            String[] pair = param.split("=");
                            if (pair.length == 2) {
                                if ("cif".equalsIgnoreCase(pair[0])) cif = Double.parseDouble(pair[1]);
                                if ("tasa".equalsIgnoreCase(pair[0])) tasa = Double.parseDouble(pair[1]);
                            }
                        }
                    }

                    List<PartidaArancelaria> lista = arancelService.buscarMercancia("Teléfonos");
                    if (!lista.isEmpty()) {
                        PartidaArancelaria p = lista.get(0);
                        CalculadoraAduanal calc = new CalculadoraAduanal(cif, tasa, p);

                        String json = String.format(
                                "{\"valorCifUsd\":%.2f, \"valorCifDop\":%.2f, \"gravamen\":%.2f, \"isc\":%.2f, \"baseItbis\":%.2f, \"itbis\":%.2f, \"totalImpuestos\":%.2f}",
                                cif, calc.calcularValorCifDop(), calc.calcularGravamen(), calc.calcularIsc(), calc.calcularBaseItbis(), calc.calcularItbis(), calc.calcularTotalImpuestos()
                        );
                        enviarRespuesta(exchange, 200, json);
                    } else {
                        enviarRespuesta(exchange, 404, "{\"error\":\"Partida no encontrada\"}");
                    }
                } else {
                    enviarRespuesta(exchange, 405, "{\"error\":\"Método no permitido\"}");
                }
            }
        });

        // 3. Endpoint general del Explorador Arancelario (/api/explorador)
        server.createContext("/api/explorador", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                configurarCors(exchange);
                List<PartidaArancelaria> lista = arancelService.buscarMercancia(""); // Trae todo el catálogo
                StringBuilder json = new StringBuilder("[");
                for (int i = 0; i < lista.size(); i++) {
                    PartidaArancelaria p = lista.get(i);
                    json.append(String.format(
                            "{\"id\":%d, \"codigoSubpartida\":\"%s\", \"descripcion\":\"%s\", \"arancelAdValorem\":%.2f, \"itbis\":%.2f, \"institucion\":\"%s\"}",
                            p.getId(), p.getCodigoSubpartida(), escapeJson(p.getDescripcion()), p.getArancelAdValorem(), p.getItbis(), escapeJson(p.getInstitucionReguladora())
                    ));
                    if (i < lista.size() - 1) json.append(",");
                }
                json.append("]");
                enviarRespuesta(exchange, 200, json.toString());
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("🚀 API REST de ArancelIA RD iniciada correctamente en: http://localhost:" + puerto + "/api/buscar?q=Teléfonos");
    }

    private static void configurarCors(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }

    private static void enviarRespuesta(HttpExchange exchange, int statusCode, String respuesta) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        byte[] bytes = respuesta.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    // Método auxiliar para evitar errores de sintaxis en JSON por comillas o saltos de línea
    private static String escapeJson(String texto) {
        if (texto == null) return "";
        return texto.replace("\"", "\\\"").replace("\n", " ").replace("\r", " ");
    }
}