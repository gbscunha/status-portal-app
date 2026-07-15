// Raiz institucional mínima. NUNCA listar clientes nem slugs aqui:
// o acesso é só pelo link secreto /r/<slug>.
export default function Home() {
  return (
    <main className="wrap" style={{ paddingTop: 40 }}>
      <div className="kicker">ITGraph</div>
      <h1>
        Portal de <span className="accent">Status</span>
      </h1>
      <p className="sub">
        Acompanhamento de projetos. Acesse pelo link que você recebeu.
      </p>
    </main>
  );
}
