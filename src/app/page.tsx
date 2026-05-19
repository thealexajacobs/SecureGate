import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          SecureGate
        </h1>
        <p className="mt-3 text-base text-neutral-500">
          Authentication and security infrastructure.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
