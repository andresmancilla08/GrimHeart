import { getTranslations } from "next-intl/server";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <AuthShell title={t("registerTitle")} subtitle={t("registerSubtitle")}>
      <AuthForm mode="register" />
    </AuthShell>
  );
}
