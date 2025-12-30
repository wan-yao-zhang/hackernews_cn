import { PasswordGenerator } from "@/components/password-generator";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <PasswordGenerator />
    </div>
  );
}
