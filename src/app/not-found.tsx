import { LinkIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

// The one 404 of the app: unknown slugs, swapped client/project pairs and any
// other URL land here (dynamicParams = false). It says nothing about which
// links exist. Title and noindex come from the root layout.
export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LinkIcon />
          </EmptyMedia>
          <EmptyTitle>
            <h1 className="text-2xl font-semibold tracking-tight">
              Página não encontrada
            </h1>
          </EmptyTitle>
          <EmptyDescription>
            O link acessado não existe ou não está mais ativo.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
