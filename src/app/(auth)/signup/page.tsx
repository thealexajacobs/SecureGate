import { SignUpForm } from "./signup-form";

export default function SignUpPage() {
  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Get started with SecureGate
        </p>
      </div>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700">
          Sign in
        </a>
      </p>
    </>
  );
}
