interface ResetPasswordEmailProps {
  token: string;
}

export function ResetPasswordEmail({ token }: ResetPasswordEmailProps) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: "40px 0" }}>
            <table width="480" cellPadding="0" cellSpacing="0" style={{ border: "1px solid #e5e5e5", borderRadius: "8px" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "40px 32px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 8px", color: "#171717" }}>
                      SecureGate
                    </h1>
                    <p style={{ fontSize: "14px", color: "#737373", margin: "0 0 24px" }}>
                      Reset your password
                    </p>
                    <p style={{ fontSize: "15px", color: "#404040", margin: "0 0 24px", lineHeight: "1.5" }}>
                      You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.
                    </p>
                    <p style={{ fontSize: "15px", color: "#404040", margin: "0 0 24px", lineHeight: "1.5" }}>
                      If you did not request this, you can safely ignore this email.
                    </p>
                    <table cellPadding="0" cellSpacing="0" style={{ margin: "0 0 24px" }}>
                      <tbody>
                        <tr>
                          <td align="center">
                            <a
                              href={resetUrl}
                              style={{
                                display: "inline-block",
                                padding: "12px 32px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#ffffff",
                                backgroundColor: "#171717",
                                borderRadius: "8px",
                                textDecoration: "none",
                              }}
                            >
                              Reset password
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style={{ fontSize: "13px", color: "#a3a3a3", margin: "0 0 8px", lineHeight: "1.5" }}>
                      If the button does not work, copy and paste this link into your browser:
                    </p>
                    <p style={{ fontSize: "13px", color: "#a3a3a3", margin: "0", lineHeight: "1.5", wordBreak: "break-all" }}>
                      {resetUrl}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
