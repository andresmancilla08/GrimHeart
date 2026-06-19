import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/characters/actions";
import { AppHeader } from "@/components/AppHeader";
import { CharacterSheetClient } from "@/components/CharacterSheetClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <AppHeader username={session.username} />
      <main className="z-10 flex-1">
        <CharacterSheetClient character={character} />
      </main>
    </div>
  );
}
