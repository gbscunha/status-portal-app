import type { Client } from "@/lib/types";

export function Footer({ client }: { client: Client }) {
  return (
    <footer>
      <span>
        {client.name} · {client.vendor}
      </span>
      <span>Documento de acompanhamento</span>
    </footer>
  );
}
