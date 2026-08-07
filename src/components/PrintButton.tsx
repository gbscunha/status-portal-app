"use client";

// Third — and smallest — client island: there is no way to open the print
// dialog without JS. It lives in the mast, which the print stylesheet already
// hides, so the button never shows up in the PDF it produces. Progressive
// enhancement: without JS the page is whole and the browser's own print
// command still works; the button is an affordance, not a crutch. It exists
// mostly for mobile, where "print to PDF" is buried in a share menu.
export function PrintButton() {
  return (
    <button type="button" className="cta" onClick={() => window.print()}>
      Salvar PDF
    </button>
  );
}
