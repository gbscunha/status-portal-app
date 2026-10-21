import { MailIcon, MessageCircleIcon } from "lucide-react";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  client: Client;
  /** Names the project in the prefilled message when present. */
  projectName?: string;
  variant?: "compact" | "footer";
};

// Static contact channels (ITGraph's, never the client's). Renders nothing
// when the client config has no whatsapp/email — safe default. Filled buttons
// (the owner's choice since v2); in the top bar they shrink to icons on a
// phone, keeping the name for screen readers.
export function ContactCta({ client, projectName, variant = "compact" }: Props) {
  const { whatsapp, email } = client;
  if (!whatsapp && !email) return null;

  const about = projectName ? `o projeto ${projectName}` : "meus projetos";
  const message = `Olá! Estou acompanhando ${about} pelo portal e gostaria de falar com vocês.`;
  const subject = projectName
    ? `Projeto ${projectName}`
    : "Acompanhamento de projetos";

  const compact = variant === "compact";
  const iconOnPhone = compact ? "max-sm:size-8 max-sm:gap-0 max-sm:px-0" : undefined;
  const label = compact ? "max-sm:sr-only" : undefined;

  const links = (
    <>
      {whatsapp && (
        <Button
          nativeButton={false}
          className={iconOnPhone}
          render={
            <a
              href={`https://wa.me/${whatsapp.slice(1)}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener"
            />
          }
        >
          <MessageCircleIcon aria-hidden="true" />
          <span className={label}>WhatsApp</span>
        </Button>
      )}
      {email && (
        <Button
          nativeButton={false}
          className={iconOnPhone}
          render={
            <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} />
          }
        >
          <MailIcon aria-hidden="true" />
          <span className={label}>E-mail</span>
        </Button>
      )}
    </>
  );

  if (compact) {
    return (
      <nav aria-label="Contato" className="flex items-center gap-2">
        {links}
      </nav>
    );
  }

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle>
          <h2>Ficou com alguma dúvida?</h2>
        </CardTitle>
        <CardDescription className="text-pretty">
          Responderemos direto — sem formulário, sem espera. Escolha o canal que
          preferir.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">{links}</CardContent>
    </Card>
  );
}
