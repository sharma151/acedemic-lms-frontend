export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-muted-foreground mb-6 text-center">
        Enter your email address to receive a password reset link.
      </p>
      {/* ForgotPasswordForm component would go here */}
    </div>
  );
}
