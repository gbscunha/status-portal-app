// Raiz institucional mínima. NUNCA listar clientes nem slugs aqui:
// o acesso é só pelo link secreto /r/<slug>.
export default function Home() {
  return (
    <main className="wrap" style={{ paddingTop: 64 }}>
      <div className="kicker" translate="no">
        ITGraph
      </div>
      <h1 className="report-title" style={{ marginTop: 12 }}>
        Portal de <span className="accent">Acompanhamento</span>
      </h1>
      <p className="sub">
        Acompanhamento de projetos. Acesse pelo link que você recebeu.
      </p>
    </main>
  );
}
