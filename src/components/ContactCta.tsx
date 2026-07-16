import type { Client } from "@/lib/types";

type Props = {
  client: Client;
  /** Names the project in the prefilled message when present. */
  projectName?: string;
  variant?: "compact" | "footer";
};

// Static contact channels (ITGraph's, never the client's). Renders nothing
// when the client config has no whatsapp/email — safe default.
export function ContactCta({ client, projectName, variant = "compact" }: Props) {
  const { whatsapp, email } = client;
  if (!whatsapp && !email) return null;

  const about = projectName ? `o projeto ${projectName}` : "meus projetos";
  const message = `Olá! Estou acompanhando ${about} pelo portal e gostaria de falar com vocês.`;
  const subject = projectName
    ? `Projeto ${projectName}`
    : "Acompanhamento de projetos";

  const links = (
    <>
      {whatsapp && (
        <a
          className="cta cta-wa"
          href={`https://wa.me/${whatsapp.slice(1)}?text=${encodeURIComponent(message)}`}
        >
          WhatsApp
        </a>
      )}
      {email && (
        <a
          className="cta cta-mail"
          href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
        >
          E-mail
        </a>
      )}
    </>
  );

  if (variant === "compact") {
    return <nav className="contact-compact" aria-label="Contato">{links}</nav>;
  }

  return (
    <section className="contact-footer" aria-label="Contato">
      <div className="kicker">Fale com a gente</div>
      <h3>Ficou com alguma dúvida?</h3>
      <p>
        Responderemos direto — sem formulário, sem espera. Escolha o canal que
        preferir.
      </p>
      <div className="contact-actions">{links}</div>
    </section>
  );
}
