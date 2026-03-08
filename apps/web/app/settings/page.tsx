import { NavBar } from "@/components/layout/NavBar";
import { ApiSettings } from "@/components/settings/ApiSettings";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <ApiSettings />
    </div>
  );
}
