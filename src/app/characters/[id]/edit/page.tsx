import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/characters/actions";
import { CharacterWizard } from "@/components/wizard/CharacterWizard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCharacterPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  // Editing is only available before any level-up.
  if (character.level > 1) redirect(`/characters/${id}`);

  return (
    <div className="relative text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <CharacterWizard editCharacter={character} />
    </div>
  );
}
