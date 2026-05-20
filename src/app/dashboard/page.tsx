import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-neutral-900">
            SecureGate
          </h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12">
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-neutral-900">
            Welcome, {session.user.name ?? session.user.email}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            You are signed in and authenticated.
          </p>
          <div className="mt-6 border-t border-neutral-100 pt-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Email</dt>
                <dd className="font-medium text-neutral-900">
                  {session.user.email}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">User ID</dt>
                <dd className="font-mono text-xs text-neutral-500">
                  {session.user.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
