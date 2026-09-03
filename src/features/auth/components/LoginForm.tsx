"use client";

import { useRef, useState, type RefObject } from "react";
import { UseFormReturn } from "react-hook-form";
import { loginSchema, LoginFormData } from "../schemas/authSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { setAuthToken } from "@/lib/auth";
import { loginWithEmail } from "../api/auth";
import { useCustomMutation } from "@/hooks/use-custom-mutation";
import { useAuthStore } from "../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export function LoginForm() {
  const formRef = useRef<UseFormReturn<LoginFormData>>(null);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate: login, isPending: isLoading } = useCustomMutation({
    service: loginWithEmail,
    form: formRef as unknown as RefObject<UseFormReturn | null>,
    successMessage: "Successfully logged in!",
    onSuccess: (data: any) => {
      if (data?.accessToken) {
        setAuthToken(data.accessToken);
        setUser(data.user);
        
        // Force React Query to drop any stale profile data from a previous session
        queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
        
        // Dynamically route based on the role returned from the login response
        const role = data.user?.role;
        if (role === "Super Admin") {
          router.replace("/super-admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
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
            <Form
              ref={formRef}
              schema={loginSchema}
              onSubmit={onSubmit}
              options={{
                defaultValues: {
                  email: "",
                  password: "",
                },
              }}
            >
              {(form) => (
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 space-y-0">
                        <FormLabel className="text-slate-700 dark:text-slate-300">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="focus-visible:ring-blue-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2 space-y-0">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-slate-700 dark:text-slate-300">
                            Password
                          </FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="focus-visible:ring-blue-600 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-slate-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-slate-500" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 pb-1 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-slate-700 dark:text-slate-300">
                          Keep me signed in
                        </FormLabel>
                      </FormItem>
                    )}
                  /> 
                  */}

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
              )}
            </Form>

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
