import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/ui/logout-button";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          403
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You do not have the necessary permissions to view this page. If you
          believe this is an error, please contact your administrator.
        </p>
        <div className="mt-8 flex justify-center items-center gap-4">
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
