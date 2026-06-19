import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Already signed in → no reason to see auth screens.
  if (await getSession()) redirect("/");

  return (
    <div className="dh-aurora dh-grain relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <div className="absolute right-5 top-5">
        <LocaleSwitcher />
      </div>
      <div className="dh-rise w-full max-w-sm">{children}</div>
    </div>
  );
}
