import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { CharacterWizard } from "@/components/wizard/CharacterWizard";

export default async function NewCharacterPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="relative text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />
      <CharacterWizard />
    </div>
  );
}
