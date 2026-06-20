import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/characters/actions";
import { SubHeader } from "@/components/SubHeader";
import { CharacterPageClient } from "@/components/CharacterPageClient";
import { CharacterActionsMenu } from "@/components/CharacterActionsMenu";

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
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <SubHeader backHref="/characters" rightElement={<CharacterActionsMenu character={character} />} />
      <main className="z-10 flex min-h-0 flex-1 flex-col">
        <CharacterPageClient character={character} />
      </main>
    </div>
  );
}
