"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/authSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { setAuthToken } from "@/lib/auth";
import { loginWithEmail } from "../api/login";
import { useCustomMutation } from "@/hooks/use-custom-mutation";

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate: login, isPending: isLoading } = useCustomMutation({
    service: loginWithEmail,
    successMessage: "Successfully logged in!",
    navigateTo: "/",
    onSuccess: (data) => {
      if (data?.accessToken) {
        setAuthToken(data.accessToken);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Form submitted! Calling API...", data);
    login(data);
  };

  return (
    <div className="w-full">
      <Card className="w-full border shadow-sm">
        <CardHeader className="space-y-1 pb-4 pt-6 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm">
            Sign in to access your portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="focus-visible:ring-blue-600"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="focus-visible:ring-blue-600"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* <div className="flex items-center space-x-2 pb-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    {...register("rememberMe")}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="font-normal text-sm text-slate-700 dark:text-slate-300"
                  >
                    Keep me signed in
                  </Label>
                </div> */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              // onClick={handleGoogleLogin}
              className="w-full bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4 text-slate-700 dark:text-slate-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
