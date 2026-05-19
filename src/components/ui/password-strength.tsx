type Strength = "weak" | "fair" | "strong";

function getStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score >= 5) return "strong";
  if (score >= 3) return "fair";
  return "weak";
}

const labels: Record<Strength, string> = {
  weak: "Weak",
  fair: "Fair",
  strong: "Strong",
};

const barStyles: Record<Strength, string> = {
  weak: "bg-red-500",
  fair: "bg-amber-500",
  strong: "bg-green-500",
};

const textStyles: Record<Strength, string> = {
  weak: "text-red-600",
  fair: "text-amber-600",
  strong: "text-green-600",
};

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getStrength(password);

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {["weak", "fair", "strong"].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              ["weak", "fair", "strong"].indexOf(strength) >=
              ["weak", "fair", "strong"].indexOf(level as Strength)
                ? barStyles[strength]
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${textStyles[strength]}`}>
        {labels[strength]} password
      </p>
    </div>
  );
}
