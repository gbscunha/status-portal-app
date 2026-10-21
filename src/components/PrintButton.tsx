"use client";

import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// The smallest client island: there is no way to open the print dialog without
// JS. It lives in the top bar, which prints hidden, so the button never shows
// up in the PDF it produces. Progressive enhancement: without JS the page is
// whole and the browser's own print command still works; the button is an
// affordance, not a crutch. It exists mostly for mobile, where "print to PDF"
// is buried in a share menu.
export function PrintButton() {
  return (
    <Button
      type="button"
      className="max-sm:size-8 max-sm:gap-0 max-sm:px-0"
      onClick={() => window.print()}
    >
      <PrinterIcon aria-hidden="true" />
      <span className="max-sm:sr-only">Salvar PDF</span>
    </Button>
  );
}
