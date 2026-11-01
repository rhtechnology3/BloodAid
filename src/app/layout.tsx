import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloodAid | Donate Blood, Save Lives",
  description: "BloodAid connects blood donors with people who need blood. Donate blood and help save lives.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
