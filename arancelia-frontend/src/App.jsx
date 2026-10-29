import React, { useState, useEffect } from 'react';

function App() {
  // Estados de Navegación y Vistas
  const [vista, setVista] = useState('inicio');
  const [tipoBusqueda, setTipoBusqueda] = useState('inteligente');

  // Estados del Formulario DUA
  const [criterio, setCriterio] = useState('');
  const [tipoValor, setTipoValor] = useState('CIF'); // 'CIF' o 'FOB'
  const [valorMonto, setValorMonto] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [tasaCambio, setTasaCambio] = useState(60.0);

  // Estados de Resultados, Selección y Alertas
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Historial Persistente con localStorage
  const [historial, setHistorial] = useState(() => {
    try {
      const guardado = localStorage.getItem('arancelia_historial_lr');
      return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
      return [];
    }
  });

  // BASE DE DATOS OFICIAL SINCRONIZADA (Catálogo Arancelario ampliado DGA)
  const baseDatosArancel = [
    {
      id: 1,
      codigoArancelario: '8517.13.00',
      descripcion: 'Teléfonos inteligentes (smartphones)',
      coincidencia: '92%',
      seccion: 'XVI - Máquinas y aparatos mecánicos y material eléctrico',
      capitulo: '85 - Máquinas, aparatos y material eléctrico y sus partes',
      partida: '8517 - Aparatos telefónicos, incluidos los teléfonos móviles (celulares).',
      subpartida: '8517.13 - Teléfonos inteligentes.',
      fraccion: '8517.13.00 - Teléfonos inteligentes (smartphones).',
      gravamen: 20.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'Sí requiere',
      permisos: 'Permiso de Homologación Previo',
      institucion: 'INDOTEL',
      observaciones: 'Comprende los teléfonos móviles, iPhones y smartphones con conectividad a internet.',
      sinonimos: ['iphone', 'telefono', 'celular', 'smartphone', 'cellphone', 'movil', 'telefono inteligente']
    },
    {
      id: 2,
      codigoArancelario: '8517.12.00',
      descripcion: 'Los demás teléfonos móviles y redes inalámbricas',
      coincidencia: '75%',
      seccion: 'XVI - Máquinas y aparatos mecánicos y material eléctrico',
      capitulo: '85 - Máquinas, aparatos y material eléctrico y sus partes',
      partida: '8517 - Aparatos telefónicos, incluidos los teléfonos móviles...',
      subpartida: '8517.12 - Los demás teléfonos móviles.',
      fraccion: '8517.12.00 - Los demás teléfonos móviles y redes.',
      gravamen: 0.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'Sí requiere',
      permisos: 'Homologación técnica',
      institucion: 'INDOTEL',
      observaciones: 'Dispositivos móviles estándar de comunicación celular.',
      sinonimos: ['telefono', 'celular', 'movil', 'radio']
    },
    {
      id: 3,
      codigoArancelario: '8517.62.00',
      descripcion: 'Relojes inteligentes, pulseras de actividad y smartwatches',
      coincidencia: '88%',
      seccion: 'XVI - Máquinas y aparatos mecánicos y material eléctrico',
      capitulo: '85 - Máquinas, aparatos y material eléctrico y sus partes',
      partida: '8517 - Aparatos de transmisión y recepción de datos.',
      subpartida: '8517.62 - Aparatos para recepción y transmisión.',
      fraccion: '8517.62.00 - Smartwatches y dispositivos wearables.',
      gravamen: 0.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'Sí requiere',
      permisos: 'Homologación técnica',
      institucion: 'INDOTEL',
      observaciones: 'Dispositivos electrónicos de pulsera con conectividad inalámbrica.',
      sinonimos: ['reloj inteligente', 'smartwatch', 'reloj', 'wearable', 'band']
    },
    {
      id: 4,
      codigoArancelario: '8471.30.00',
      descripcion: 'Máquinas portátiles para tratamiento de datos (Laptops)',
      coincidencia: '95%',
      seccion: 'XVI - Máquinas y aparatos mecánicos y material eléctrico',
      capitulo: '84 - Reactores nucleares, calderas, máquinas y aparatos mecánicos',
      partida: '8471 - Máquinas automáticas para tratamiento de datos...',
      subpartida: '8471.30 - Máquinas portátiles.',
      fraccion: '8471.30.00 - Computadoras portátiles peso <= 10 kg.',
      gravamen: 0.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'No requiere',
      permisos: 'No requiere',
      institucion: 'Ninguna',
      observaciones: 'Libre de arancel por acuerdos de tecnología de información.',
      sinonimos: ['laptop', 'computadora', 'ordenador', 'notebook', 'macbook']
    },
    {
      id: 5,
      codigoArancelario: '6403.99.00',
      descripcion: 'Calzado deportivo (Tenis) con suela de caucho y cuero',
      coincidencia: '91%',
      seccion: 'XII - Calzado, sombreros, paraguas',
      capitulo: '64 - Calzado, polainas y artículos análogos',
      partida: '6403 - Calzado con suela de caucho, plástico, cuero...',
      subpartida: '6403.99 - Los demás calzados.',
      fraccion: '6403.99.00 - Calzado general deportivo o casual.',
      gravamen: 20.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'No requiere',
      permisos: 'No requiere',
      institucion: 'Ninguna',
      observaciones: 'Calzado de uso general deportivo, tenis o chancletas.',
      sinonimos: ['tenis', 'calzado', 'zapatillas', 'zapatos', 'chancletas', 'botas']
    },
    {
      id: 6,
      codigoArancelario: '3303.00.00',
      descripcion: 'Perfumes y aguas de tocador',
      coincidencia: '90%',
      seccion: 'VI - Productos de las industrias químicas',
      capitulo: '33 - Aceites esenciales y resinoides; perfumería...',
      partida: '3303 - Perfumes y aguas de tocador.',
      subpartida: '3303.00 - Perfumes y aguas de tocador.',
      fraccion: '3303.00.00 - Perfumería terminada.',
      gravamen: 20.0,
      itbis: 18.0,
      selectivo: 0.0,
      vuce: 'Sí requiere',
      permisos: 'Registro Sanitario OBLIGATORIO',
      institucion: 'DIGEMAPS',
      observaciones: 'Productos cosméticos de perfumería terminados.',
      sinonimos: ['perfume', 'colonia', 'fragancia', 'tocador']
    }
  ];

  // Sincronizar historial con localStorage
  useEffect(() => {
    try {
      localStorage.setItem('arancelia_historial_lr', JSON.stringify(historial));
    } catch (e) {
      console.error(e);
    }
  }, [historial]);

  // Búsqueda inteligente preservando el texto original del usuario y aplicando criterio de analista
  const realizarBusqueda = () => {
    setErrorBusqueda('');
    if (!criterio.trim()) {
      setResultados([]);
      setSeleccionado(null);
      return;
    }

    const termino = criterio.toLowerCase().trim();

    const filtrados = baseDatosArancel.filter(item =>
        item.descripcion.toLowerCase().includes(termino) ||
        item.codigoArancelario.includes(termino) ||
        item.sinonimos.some(s => termino.includes(s) || s.includes(termino))
    );

    if (filtrados.length > 0) {
      setResultados(filtrados);
      setSeleccionado(filtrados[0]); // Selecciona la mejor coincidencia automáticamente
    } else {
      setResultados([]);
      setSeleccionado(null);
      setErrorBusqueda('La descripción introducida no permite determinar una clasificación con suficiente confianza. Se requiere información adicional.');
    }
  };

  // CÁLCULOS TRIBUTARIOS Y DISTINCIÓN RIGUROSA ENTRE CIF Y FOB
  const montoNumerico = Number(valorMonto) || 0;

  // Regla aduanal: Si el usuario selecciona FOB, se incorpora un flete y seguro estimado (ej. 10%) para obtener la base CIF imponible. Si es CIF, se toma el valor directo.
  const baseCalculoUsd = tipoValor === 'CIF' ? montoNumerico : montoNumerico * 1.10;
  const cifDopVal = moneda === 'USD' ? baseCalculoUsd * tasaCambio : montoNumerico * (moneda === 'DOP' ? 1 : tasaCambio);

  const gravamenPct = seleccionado ? seleccionado.gravamen : 0;
  const selectivoPct = seleccionado ? seleccionado.selectivo : 0;
  const itbisPct = seleccionado ? seleccionado.itbis : 18;

  const montoGravamen = cifDopVal * (gravamenPct / 100);
  const montoSelectivo = (cifDopVal + montoGravamen) * (selectivoPct / 100);
  const baseImponibleItbis = cifDopVal + montoGravamen + montoSelectivo;
  const montoItbis = baseImponibleItbis * (itbisPct / 100);
  const totalImpuestos = montoGravamen + montoSelectivo + montoItbis;

  // Guardado en Historial
  const guardarHistorial = () => {
    if (!seleccionado) {
      alert('Debe seleccionar una partida válida antes de registrar la consulta.');
      return;
    }
    const nuevo = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      mercancia: criterio,
      partida: seleccionado.codigoArancelario,
      tipoValor: tipoValor,
      montoOriginal: montoNumerico,
      moneda: moneda,
      tasaCambioUsada: tasaCambio,
      cifDop: cifDopVal,
      total: totalImpuestos
    };
    setHistorial([nuevo, ...historial]);
    setMensajeExito('¡Consulta registrada con éxito en el historial persistente!');
    setTimeout(() => setMensajeExito(''), 3500);
  };

  const exportarPDF = () => {
    if (!seleccionado) {
      alert('Seleccione una partida para exportar el reporte.');
      return;
    }
    window.print();
  };

  return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#eef2f5', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', overflow: 'hidden' }}>

        {/* 1. BARRA LATERAL ADAPTABLE */}
        <aside style={{ width: '250px', backgroundColor: '#002b49', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '15px 0', flexShrink: 0 }}>
          <div>
            <div style={{ padding: '0 20px 15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ff4d4d' }}>✚</span> ArancelIA RD
              </h2>
              <small style={{ opacity: 0.7, fontSize: '10px' }}>Sistema Integrado de Gestión Aduanera</small>
            </div>

            <nav style={{ marginTop: '10px' }}>
              <div onClick={() => setVista('inicio')} style={{ padding: '10px 20px', backgroundColor: vista === 'inicio' ? '#004080' : 'transparent', cursor: 'pointer', borderLeft: vista === 'inicio' ? '4px solid #00a8ff' : 'none', fontSize: '12px' }}>🏠 Inicio</div>
              <div onClick={() => setVista('inicio')} style={{ padding: '10px 20px', backgroundColor: vista === 'inicio' ? '#004080' : 'transparent', cursor: 'pointer', fontSize: '12px' }}>🔍 Buscar mercancía</div>
              <div onClick={() => setVista('explorador')} style={{ padding: '10px 20px', backgroundColor: vista === 'explorador' ? '#004080' : 'transparent', cursor: 'pointer', borderLeft: vista === 'explorador' ? '4px solid #00a8ff' : 'none', fontSize: '12px' }}>📖 Explorador del Arancel</div>
              <div onClick={() => setVista('calculadora')} style={{ padding: '10px 20px', backgroundColor: vista === 'calculadora' ? '#004080' : 'transparent', cursor: 'pointer', borderLeft: vista === 'calculadora' ? '4px solid #00a8ff' : 'none', fontSize: '12px' }}>🧮 Calculadora de Impuestos</div>
              <div onClick={() => setVista('historial')} style={{ padding: '10px 20px', backgroundColor: vista === 'historial' ? '#004080' : 'transparent', cursor: 'pointer', borderLeft: vista === 'historial' ? '4px solid #00a8ff' : 'none', fontSize: '12px' }}>📜 Historial ({historial.length})</div>
            </nav>
          </div>

          <div style={{ padding: '15px 20px', fontSize: '10px', opacity: 0.6, borderTop: '1px solid rgba(255,255,255,0.1)', fontStyle: 'italic' }}>
            "Facilitando el comercio, impulsando el país."
          </div>
        </aside>

        {/* 2. CONTENEDOR PRINCIPAL A TODA PANTALLA */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

          {/* HEADER SUPERIOR */}
          <header style={{ backgroundColor: '#fff', padding: '10px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0', flexShrink: 0 }}>
            <div style={{ fontWeight: 'bold', color: '#444', fontSize: '12px', letterSpacing: '0.5px' }}>VERSIÓN MVP - FUNCIONAL</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0055a5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                  LR
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#333' }}>Luis Rodríguez</div>
                  <div style={{ fontSize: '10px', color: '#777' }}>Agente de Aduana</div>
                </div>
              </div>
            </div>
          </header>

          {mensajeExito && (
              <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '8px 20px', fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #c3e6cb' }}>
                {mensajeExito}
              </div>
          )}

          <div style={{ padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>

            {vista === 'inicio' && (
                <>
                  {/* PESTAÑAS DE BÚSQUEDA */}
                  <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
                <span
                    onClick={() => setTipoBusqueda('inteligente')}
                    style={{ fontWeight: 'bold', color: tipoBusqueda === 'inteligente' ? '#0055a5' : '#666', borderBottom: tipoBusqueda === 'inteligente' ? '2px solid #0055a5' : 'none', paddingBottom: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🔍 Búsqueda Inteligente
                </span>
                    <span
                        onClick={() => setTipoBusqueda('codigo')}
                        style={{ fontWeight: 'bold', color: tipoBusqueda === 'codigo' ? '#0055a5' : '#666', borderBottom: tipoBusqueda === 'codigo' ? '2px solid #0055a5' : 'none', paddingBottom: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                  📑 Búsqueda por Código
                </span>
                  </div>

                  {/* BARRA DE ENTRADA CON CAMPOS CORREGIDOS Y ALTO CONTRASTE */}
                  <div style={{ backgroundColor: '#fff', padding: '12px 18px', borderRadius: '6px', border: '1px solid #e0e0e0', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 2, minWidth: '250px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '3px' }}>
                        Describe la mercancía que deseas consultar
                      </label>
                      <input
                          type="text"
                          value={criterio}
                          onChange={(e) => {
                            setCriterio(e.target.value); // Conserva el texto original sin sobrescribir ni modificar
                            realizarBusqueda();
                          }}
                          placeholder="Ej. iPhone 17 Pro Max de 256 GB, Smartwatch..."
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px', color: '#000', backgroundColor: '#fff', outline: 'none' }}
                      />
                    </div>

                    <div style={{ width: '110px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '3px' }}>
                        Tipo Base
                      </label>
                      <select
                          value={tipoValor}
                          onChange={(e) => setTipoValor(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px', color: '#000', backgroundColor: '#fff' }}
                      >
                        <option value="CIF">Valor CIF</option>
                        <option value="FOB">Valor FOB</option>
                      </select>
                    </div>

                    <div style={{ width: '130px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '3px' }}>
                        Monto ({moneda})
                      </label>
                      <input
                          type="number"
                          value={valorMonto}
                          onChange={(e) => setValorMonto(e.target.value)}
                          placeholder="Ej. 1200"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px', color: '#000', backgroundColor: '#fff', outline: 'none' }}
                      />
                    </div>

                    <div style={{ width: '95px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '3px' }}>Moneda</label>
                      <select
                          value={moneda}
                          onChange={(e) => setMoneda(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px', color: '#000', backgroundColor: '#fff' }}
                      >
                        <option value="USD">USD</option>
                        <option value="DOP">DOP</option>
                      </select>
                    </div>

                    <button
                        onClick={realizarBusqueda}
                        style={{ backgroundColor: '#0055a5', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🔍 Buscar
                    </button>
                  </div>

                  {errorBusqueda && (
                      <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px 15px', borderRadius: '4px', fontSize: '12px' }}>
                        ⚠️ {errorBusqueda}
                      </div>
                  )}

                  {/* TRES PANELES PRINCIPALES ADAPTABLES A PANTALLA COMPLETA */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '15px', alignItems: 'start' }}>

                    {/* PANEL 1: RESULTADOS DE LA BÚSQUEDA */}
                    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', minHeight: '380px' }}>
                      <h4 style={{ margin: '0 0 4px 0', color: '#333', fontSize: '12px' }}>Resultados de la búsqueda</h4>
                      <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                        {resultados.length > 0 ? `Se encontraron ${resultados.length} posibles partidas arancelarias.` : 'Realice una consulta para ver sugerencias.'}
                      </p>

                      {resultados.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '50px 10px', color: '#aaa', fontSize: '12px' }}>
                            Sin resultados en pantalla. Ingrese una descripción de mercancía.
                          </div>
                      ) : (
                          resultados.map((item) => {
                            const esSeleccionado = seleccionado && seleccionado.id === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSeleccionado(item)}
                                    style={{
                                      border: esSeleccionado ? '2px solid #28a745' : '1px solid #e0e0e0',
                                      backgroundColor: esSeleccionado ? '#f4fbf7' : '#fff',
                                      padding: '10px',
                                      borderRadius: '6px',
                                      marginBottom: '8px',
                                      cursor: 'pointer'
                                    }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ color: '#0055a5', fontSize: '12px' }}>{item.codigoArancelario}</strong>
                                    <span style={{ backgroundColor: esSeleccionado ? '#28a745' : '#e0e0e0', color: esSeleccionado ? '#fff' : '#333', fontSize: '9px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                              {esSeleccionado ? `Seleccionado (${item.coincidencia})` : item.coincidencia}
                            </span>
                                  </div>
                                  <div style={{ fontSize: '11px', marginTop: '4px', color: '#333' }}>{item.descripcion}</div>
                                </div>
                            );
                          })
                      )}
                    </div>

                    {/* PANEL 2: DETALLE DE LA PARTIDA SELECCIONADA */}
                    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '380px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, color: '#333', fontSize: '12px' }}>Detalle de la partida seleccionada</h4>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                            <span onClick={guardarHistorial} style={{ cursor: 'pointer', color: '#0055a5', fontWeight: 'bold' }}>💾 Guardar</span>
                            <span onClick={exportarPDF} style={{ cursor: 'pointer', color: '#0055a5', fontWeight: 'bold' }}>📄 Exportar PDF</span>
                          </div>
                        </div>

                        {seleccionado ? (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div style={{ width: '35px', height: '35px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>
                                <div>
                                  <h2 style={{ margin: 0, color: '#003366', fontSize: '16px' }}>{seleccionado.codigoArancelario}</h2>
                                  <h3 style={{ margin: 0, color: '#333', fontSize: '11px', fontWeight: 'bold' }}>{seleccionado.descripcion}</h3>
                                </div>
                              </div>

                              <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid #eee', paddingTop: '6px' }}>
                                <div><strong>Sección:</strong> {seleccionado.seccion}</div>
                                <div><strong>Capítulo:</strong> {seleccionado.capitulo}</div>
                                <div><strong>Partida:</strong> {seleccionado.partida}</div>
                                <div><strong>Subpartida:</strong> {seleccionado.subpartida}</div>
                                <div><strong>Fracción:</strong> {seleccionado.fraccion}</div>
                              </div>

                              <div style={{ marginTop: '10px', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #eee', fontSize: '11px' }}>
                                <strong style={{ color: '#333' }}>Descripción oficial (DGA):</strong>
                                <p style={{ margin: '2px 0 0 0', color: '#555', fontStyle: 'italic' }}>"{seleccionado.observaciones}"</p>
                              </div>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '50px 10px', color: '#aaa', fontSize: '12px' }}>
                              Seleccione una partida de los resultados para ver su detalle oficial.
                            </div>
                        )}
                      </div>
                    </div>

                    {/* PANEL 3: CÁLCULO DE IMPUESTOS Y REQUISITOS VUCE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                      <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '12px' }}>🧮 Cálculo de Impuestos Estimados</h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px', backgroundColor: '#f8f9fa', padding: '6px', borderRadius: '4px' }}>
                          <div>Base {tipoValor} ({moneda})<br/><strong style={{ fontSize: '12px', color: '#003366' }}>{moneda === 'USD' ? 'US$' : 'RD$'} {montoNumerico.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
                          <div>Base CIF (DOP)<br/><strong style={{ fontSize: '12px', color: '#003366' }}>RD$ {cifDopVal.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
                        </div>
                        <div style={{ fontSize: '9px', color: '#777', marginBottom: '8px' }}>Tasa: 1 USD = {tasaCambio}.00 DOP | Base aplicada: {tipoValor}</div>

                        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                          <thead>
                          <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left', color: '#555' }}>
                            <th style={{ padding: '4px' }}>Impuesto</th>
                            <th style={{ padding: '4px' }}>%</th>
                            <th style={{ padding: '4px', textAlign: 'right' }}>Monto (DOP)</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '4px' }}>Gravamen</td>
                            <td style={{ padding: '4px' }}>{gravamenPct}%</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{montoGravamen.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '4px' }}>Selectivo (ISC)</td>
                            <td style={{ padding: '4px' }}>{selectivoPct}%</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{montoSelectivo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '4px' }}>ITBIS</td>
                            <td style={{ padding: '4px' }}>{itbisPct}%</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{montoItbis.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          </tr>
                          </tbody>
                        </table>

                        <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e6f4ea', borderRadius: '4px', color: '#137333', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px' }}>Total de Impuestos</span>
                          <span style={{ fontSize: '12px' }}>RD$ {totalImpuestos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>

                      {/* Requisitos VUCE */}
                      <div style={{ backgroundColor: '#fff', padding: '12px 15px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '11px' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '12px' }}>📑 Requisitos de Importación</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>¿Requiere VUCE?</span>
                            <span style={{ backgroundColor: seleccionado && seleccionado.vuce === 'Sí requiere' ? '#fff3cd' : '#e6f4ea', color: seleccionado && seleccionado.vuce === 'Sí requiere' ? '#856404' : '#137333', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                          {seleccionado ? seleccionado.vuce : 'No requiere'}
                        </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Permisos</span>
                            <strong>{seleccionado ? seleccionado.permisos : 'No requiere'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Institución Reguladora</span>
                            <strong style={{ color: '#003366' }}>{seleccionado ? seleccionado.institucion : 'Ninguna'}</strong>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </>
            )}

            {/* EXPLORADOR DE ARANCEL */}
            {vista === 'explorador' && (
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h2 style={{ color: '#002b49', marginTop: 0, fontSize: '16px' }}>📖 Explorador Oficial del Arancel de Aduanas (DGA)</h2>
                  <p style={{ color: '#555', fontSize: '12px' }}>Listado de partidas arancelarias oficiales sincronizadas.</p>

                  <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {baseDatosArancel.map(item => (
                        <div key={item.id} style={{ padding: '10px 12px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <div>
                            <strong style={{ color: '#0055a5' }}>{item.codigoArancelario}</strong> - {item.descripcion}
                            <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Regulador: <strong>{item.institucion}</strong> | Gravamen: {item.gravamen}%</div>
                          </div>
                          <button
                              onClick={() => { setSeleccionado(item); setVista('inicio'); }}
                              style={{ backgroundColor: '#0055a5', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                          >
                            Consultar
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* CALCULADORA DE IMPUESTOS */}
            {vista === 'calculadora' && (
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h2 style={{ color: '#002b49', marginTop: 0, fontSize: '16px' }}>🧮 Calculadora de Impuestos Independiente</h2>
                  <p style={{ color: '#555', fontSize: '12px' }}>Simulador tributario rápido con base CIF o FOB.</p>
                  <div style={{ marginTop: '15px', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Monto:</label>
                      <input type="number" value={valorMonto} onChange={(e) => setValorMonto(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <button onClick={() => setVista('inicio')} style={{ backgroundColor: '#0055a5', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Ir al Módulo DUA
                    </button>
                  </div>
                </div>
            )}

            {/* HISTORIAL */}
            {vista === 'historial' && (
                <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h2 style={{ color: '#002b49', marginTop: 0, fontSize: '16px' }}>📜 Historial de Consultas Registradas</h2>
                  <p style={{ color: '#555', fontSize: '12px' }}>Auditoría de consultas guardadas por el Agente Luis Rodríguez.</p>

                  {historial.length === 0 ? (
                      <p style={{ color: '#777', fontStyle: 'italic', marginTop: '15px', fontSize: '12px' }}>No hay consultas guardadas todavía.</p>
                  ) : (
                      <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {historial.map((item) => (
                            <div key={item.id} style={{ padding: '10px 12px', backgroundColor: '#fafafa', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                              <div>
                                <div style={{ fontWeight: 'bold', color: '#003366' }}>{item.mercancia} ({item.partida})</div>
                                <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Fecha: {item.fecha} | Base {item.tipoValor}: {item.moneda === 'USD' ? 'US$' : 'RD$'} {Number(item.montoOriginal).toLocaleString()} | Total Impuestos: <strong>RD$ {Number(item.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></div>
                              </div>
                              <button onClick={() => { setCriterio(item.mercancia); setVista('inicio'); }} style={{ backgroundColor: '#0055a5', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                                Recuperar
                              </button>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

          </div>
        </main>

      </div>
  );
}

export default App;