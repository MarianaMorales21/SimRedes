"use client"

export default function Informacion() {
    return (
        <>
            <div className="page-wrapper">
                <div className="container">
                    <header>
                        <h1>🌐Simulación de Redes</h1>
                        <p className="subtitle">Componentes, Configuración y Uso de Simuladores de Red</p>
                    </header>

                    <section className="section">
                        <h2>🔧 Componentes de Red Principales</h2>
                        <div className="component-grid">
                            <div className="component-card">
                                <div className="component-title">🖥️ Computadoras / Dispositivos Finales</div>
                                <div className="component-description">
                                    Dispositivos que generan y consumen datos en la red. Son los puntos de origen y destino de las
                                    comunicaciones.
                                </div>
                                <ul className="component-features">
                                    <li>PC de escritorio</li>
                                    <li>Laptops</li>
                                    <li>Servidores</li>
                                    <li>Smartphones</li>
                                    <li>Tablets</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🔄 Switches (Conmutadores)</div>
                                <div className="component-description">
                                    Dispositivos de capa 2 que conectan múltiples dispositivos en una red local, creando dominios de
                                    colisión separados.
                                </div>
                                <ul className="component-features">
                                    <li>Tabla MAC</li>
                                    <li>Múltiples puertos</li>
                                    <li>Full-duplex</li>
                                    <li>VLANs</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🚦 Routers (Enrutadores)</div>
                                <div className="component-description">
                                    Dispositivos de capa 3 que interconectan diferentes redes, tomando decisiones de enrutamiento basadas
                                    en direcciones IP.
                                </div>
                                <ul className="component-features">
                                    <li>Tabla de enrutamiento</li>
                                    <li>Protocolos de enrutamiento</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🛡️ Firewalls</div>
                                <div className="component-description">
                                    Dispositivos de seguridad que filtran y controlan el tráfico de red basándose en reglas de seguridad
                                    predefinidas.
                                </div>
                                <ul className="component-features">
                                    <li>Filtrado de paquetes</li>
                                    <li>Reglas de seguridad</li>
                                    <li>VPN</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">📡 Access Points (Puntos de Acceso)</div>
                                <div className="component-description">
                                    Dispositivos que proporcionan conectividad inalámbrica, actuando como puente entre redes cableadas e
                                    inalámbricas.
                                </div>
                                <ul className="component-features">
                                    <li>WiFi 802.11</li>
                                    <li>Encriptación WPA/WPA2</li>
                                    <li>Roaming</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🔌 Hubs (Concentradores)</div>
                                <div className="component-description">
                                    Dispositivos básicos de capa 1 que simplemente repiten señales. Obsoletos pero útiles para entender
                                    conceptos básicos.
                                </div>
                                <ul className="component-features">
                                    <li>Dominio de colisión</li>
                                    <li>Half-duplex</li>
                                    <li>Repetidor</li>
                                    <li>Compartido</li>
                                    <li>Básico</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h2>🔗 Tipos de Cables y Conectores</h2>
                        <div className="cable-types">
                            <div className="cable-type">
                                <div className="cable-name">Cable Directo (Straight-through)</div>
                                <div className="cable-desc">Conecta dispositivos diferentes: PC-Switch, Switch-Router</div>
                            </div>
                            <div className="cable-type">
                                <div className="cable-name">Cable Cruzado (Crossover)</div>
                                <div className="cable-desc">Conecta dispositivos similares: Switch-Switch, PC-PC</div>
                            </div>
                            <div className="cable-type">
                                <div className="cable-name">Cable Serial</div>
                                <div className="cable-desc">Conexiones WAN entre routers</div>
                            </div>
                            <div className="cable-type">
                                <div className="cable-name">Cable Coaxial</div>
                                <div className="cable-desc">Conexiones de cable módem y redes más antiguas</div>
                            </div>
                            <div className="cable-type">
                                <div className="cable-name">Fibra Óptica</div>
                                <div className="cable-desc">Conexiones de alta velocidad y larga distancia</div>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h2>🔌 Puertos y Interfaces</h2>
                        <div className="component-grid">
                            <div className="component-card">
                                <div className="component-title">Puertos Ethernet</div>
                                <div className="component-description">Interfaces estándar para conexiones de red cableada.</div>
                                <ul className="component-features">
                                    <li>10/100/1000 Mbps</li>
                                    <li>RJ45</li>
                                    <li>Auto-negotiation</li>
                                    <li>PoE</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">Puertos Serial</div>
                                <div className="component-description">Interfaces para conexiones WAN y administración.</div>
                                <ul className="component-features">
                                    <li>DCE/DTE</li>
                                    <li>Clock Rate</li>
                                    <li>RS-232</li>
                                    <li>Console</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">Puertos USB</div>
                                <div className="component-description">Para conexiones de administración y almacenamiento.</div>
                                <ul className="component-features">
                                    <li>Console</li>
                                    <li>Backup</li>
                                    <li>Firmware</li>
                                    <li>Logs</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">Puertos SFP</div>
                                <div className="component-description">Para módulos de fibra óptica intercambiables.</div>
                                <ul className="component-features">
                                    <li>Fibra óptica</li>
                                    <li>Intercambiable</li>
                                    <li>Larga distancia</li>
                                    <li>Alta velocidad</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h2>⚙️ Dispositivos Intermedios</h2>
                        <div className="component-grid">
                            <div className="component-card">
                                <div className="component-title">🔄 Repetidores</div>
                                <div className="component-description">
                                    Regeneran señales para extender la distancia de transmisión.
                                </div>
                                <ul className="component-features">
                                    <li>Amplificación</li>
                                    <li>Regeneración</li>
                                    <li>Extensión</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🌉 Bridges</div>
                                <div className="component-description">Conectan segmentos de red, filtrando tráfico por MAC.</div>
                                <ul className="component-features">
                                    <li>Tabla MAC</li>
                                    <li>Filtrado</li>
                                    <li>Segmentación</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🔀 Multiplexores</div>
                                <div className="component-description">
                                    Combinan múltiples señales en una sola línea de transmisión.
                                </div>
                                <ul className="component-features">
                                    <li>TDM</li>
                                    <li>FDM</li>
                                    <li>WDM</li>
                                </ul>
                            </div>

                            <div className="component-card">
                                <div className="component-title">🛰️ Módems</div>
                                <div className="component-description">
                                    Modulan y demodulán señales para transmisión a larga distancia.
                                </div>
                                <ul className="component-features">
                                    <li>DSL</li>
                                    <li>Cable</li>
                                    <li>Satellite</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="section">
                        <h2>🎮 Cómo Usar el Simulador de Red</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Configuración Inicial</div>
                                    <div className="step-description">
                                        Abre el simulador y familiarízate con la interfaz. Identifica la barra lateral con los
                                        dispositivos disponibles.
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Agregar Dispositivos</div>
                                    <div className="step-description">
                                        Arrastra dispositivos desde la barra lateral. Dispositivos
                                        como PCs, switches y routers.
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Conectar Dispositivos</div>
                                    <div className="step-description">
                                        Conecta los dispositivos. Asignando el respectivo puerto de conexion.
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Configurar Direcciones IP</div>
                                    <div className="step-description">
                                        Asigna direcciones IP a cada dispositivo. Asegúrate de que estén en la misma subred para
                                        comunicación local.
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Configurar Dispositivos de Red</div>
                                    <div className="step-description">
                                        Configura switches y routers según los requerimientos de tu
                                        red.
                                    </div>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-content">
                                    <div className="step-title">Probar Conectividad</div>
                                    <div className="step-description">
                                        Usa herramientas como ping para verificar la conectividad y
                                        funcionamiento de la red.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>



                    <footer className="footer">
                        <h3 style={{ color: "white" }}>🌐 Simuladores de Red</h3>
                        <p>
                            <strong>Packet Tracer</strong> - Cisco | <strong>GNS3</strong> - Graphical Network Simulator |{" "}
                            <strong>EVE-NG</strong> - Emulated Virtual Environment
                        </p>
                        <p>
                            <strong>Boson NetSim</strong> - Network Simulator | <strong>Mininet</strong> - Network Emulator
                        </p>
                        <br />
                        <p>© 2025 Simulación de Redes</p>
                    </footer>
                </div>
            </div>

            <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .page-wrapper {
          min-height: 100vh;
          background: white;
          background-attachment: fixed;
          padding: 20px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 30px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }


        .subtitle {
          color: #7f8c8d;
          font-size: 1.2em;
          font-weight: 300;
        }

        .section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 25px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .section:hover {
          transform: translateY(-5px);
        }

        h2 {
          color: #2c3e50;
          font-size: 1.8em;
          margin-bottom: 20px;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }

        h3 {
          color: #34495e;
          font-size: 1.3em;
          margin: 25px 0 15px 0;
          display: flex;
          align-items: center;
        }

        .component-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .component-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
          padding: 20px;
          border-left: 5px solid #3498db;
          transition: all 0.3s ease;
        }

        .component-card:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .component-title {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.1em;
        }

        .component-description {
          color: #5a6c7d;
          font-size: 0.95em;
          margin-bottom: 10px;
        }

        .component-features {
          list-style: none;
          margin-top: 10px;
        }

        .component-features li {
          background: #3498db;
          color: white;
          padding: 5px 10px;
          margin: 5px 0;
          border-radius: 15px;
          font-size: 0.85em;
          display: inline-block;
          margin-right: 5px;
        }

        .steps {
          counter-reset: step-counter;
        }

        .step {
          counter-increment: step-counter;
          background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 100%);
          border-radius: 10px;
          padding: 20px;
          margin: 15px 0;
          border-left: 5px solid #17a2b8;
          position: relative;
          overflow: hidden;
        }

        .step::before {
          content: counter(step-counter);
          position: absolute;
          top: 15px;
          left: 15px;
          background: #17a2b8;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1em;
        }

        .step-content {
          margin-left: 50px;
        }

        .step-title {
          font-weight: bold;
          color: #0c5460;
          margin-bottom: 8px;
        }

        .cable-types {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 15px;
        }

        .cable-type {
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          color: white;
          padding: 15px 20px;
          border-radius: 25px;
          text-align: center;
          flex: 1;
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .cable-type:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cable-name {
          font-weight: bold;
          font-size: 1.1em;
          margin-bottom: 5px;
        }

        .cable-desc {
          font-size: 0.9em;
          opacity: 0.9;
        }

        .simulator-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .feature {
          background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%);
          color: #2c3e50;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 2em;
          margin-bottom: 10px;
        }

        .feature-title {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .tips {
          background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
          color: white;
          padding: 25px;
          border-radius: 15px;
          margin-top: 20px;
        }

        .tips h3 {
          color: white;
          margin-bottom: 15px;
        }

        .tips ul {
          list-style: none;
        }

        .tips li {
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tips li:last-child {
          border-bottom: none;
        }

        .tips li::before {
          content: "💡";
          margin-right: 10px;
        }

        .footer {
          background: rgba(44, 62, 80, 0.9);
          color: white;
          text-align: center;
          padding: 30px;
          border-radius: 15px;
          margin-top: 40px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .page-wrapper {
            padding: 10px 0;
          }

          .container {
            padding: 0 10px;
          }

          h1 {
            font-size: 2em;
          }

          .component-grid {
            grid-template-columns: 1fr;
          }

          .cable-types {
            flex-direction: column;
          }

          .cable-type {
            min-width: auto;
          }

          .simulator-features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </>
    )
}
