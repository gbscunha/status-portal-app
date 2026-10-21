import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

// Raiz institucional mínima. NUNCA listar clientes nem slugs aqui:
// o acesso é só pelo link secreto /r/<slug>. Fora da moldura com sidebar:
// não há cliente nem navegação.
export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <span
              className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
              translate="no"
            >
              IT<span className="sr-only">Graph</span>
            </span>
          </EmptyMedia>
          <EmptyTitle>
            <h1 className="text-2xl font-semibold tracking-tight">
              Portal de Acompanhamento
            </h1>
          </EmptyTitle>
          <EmptyDescription>
            Acompanhamento de projetos. Acesse pelo link que você recebeu.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
