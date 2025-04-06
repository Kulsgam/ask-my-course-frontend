import { useEffect, useState } from "react";
import { logOut } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await logOut();
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error.message || "Failed to logout. Please try again.");
      }
    })();
  }, []);

  return error ? (
    <div className="m-auto flex flex-col items-center justify-center gap-4 p-6">
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Logout Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <Button onClick={() => navigate("/")}>Continue to Home</Button>
    </div>
  ) : (
    <div className="text-muted-foreground m-auto text-center text-sm">
      Logging out...
    </div>
  );
}
