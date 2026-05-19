import { LoginForm } from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string };
}) {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in to your account
        </p>
      </div>
      {searchParams.registered && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Account created. Check your email to verify your account.
        </div>
      )}
      <LoginForm />
      <p className="mt-6 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <a
          href="/signup"
          className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
        >
          Create one
        </a>
      </p>
    </>
  );
}
