import type { CSSProperties, ReactNode } from "react";
import type { Client } from "@/lib/types";
import { ContactCta } from "./ContactCta";
import { PrintButton } from "./PrintButton";

// Shell shared by every client page: sets the brand color (--brand, the only
// inline style in the app) and renders the sticky mast. The print button only
// shows when the page has a report to print.
export function ClientShell({
  client,
  printable,
  children,
}: {
  client: Client;
  printable: boolean;
  children: ReactNode;
}) {
  const brandStyle = { "--brand": client.brandColor } as CSSProperties;
  const contact = <ContactCta client={client} variant="compact" />;

  return (
    <main className="client" style={brandStyle}>
      <header className="mast">
        <div className="wrap mast-row">
          <span className="mast-vendor" translate="no">
            {client.vendor} · Portal de acompanhamento
          </span>
          {printable ? (
            <div className="mast-actions">
              <PrintButton />
              {contact}
            </div>
          ) : (
            contact
          )}
        </div>
      </header>
      {children}
    </main>
  );
}
