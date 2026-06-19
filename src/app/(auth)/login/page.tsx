import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AuthShell title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
