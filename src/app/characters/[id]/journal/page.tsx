import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/characters/actions";
import { SubHeader } from "@/components/SubHeader";
import { JournalClient } from "@/components/JournalClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JournalPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <SubHeader backHref={`/characters/${id}`} />
      <JournalClient
        characterId={id}
        characterName={character.name}
        entries={character.journal ?? []}
      />
    </div>
  );
}
