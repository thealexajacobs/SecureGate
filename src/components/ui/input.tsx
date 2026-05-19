"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
