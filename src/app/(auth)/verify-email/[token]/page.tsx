"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Status = "verifying" | "success" | "expired" | "invalid" | "error";

const statusConfig: Record<Status, { title: string; message: string }> = {
  verifying: {
    title: "Verifying your email...",
    message: "Please wait while we verify your email address.",
  },
  success: {
    title: "Email verified",
    message: "Your email has been verified successfully. You can now sign in to your account.",
  },
  expired: {
    title: "Link expired",
    message: "This link has expired. Please request a new one.",
  },
  invalid: {
    title: "Invalid link",
    message: "This link is invalid or has already been used.",
  },
  error: {
    title: "Something went wrong",
    message: "Something went wrong. Please try again.",
  },
};

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error?.toLowerCase().includes("expired")) {
            setStatus("expired");
          } else {
            setStatus("invalid");
          }
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
      }
    }

    verify();
  }, [token]);

  const { title, message } = statusConfig[status];

  return (
    <div className="text-center">
      <div className="mb-8">
        {status === "verifying" && (
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
        )}
        {status === "success" && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}
        {(status === "expired" || status === "invalid") && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        {title}
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {message}
      </p>
      {(status === "success" || status === "expired" || status === "invalid") && (
        <div className="mt-8">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            {status === "success" ? "Sign in" : "Back to login"}
          </Link>
        </div>
      )}
    </div>
  );
}
