import { useState } from "react";
import { useAuth, loginSchema } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Logo } from "@/components/common/logo";

export default function SuperAdminLogin() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Redirect to home if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoginError(null);
      await loginMutation.mutateAsync(data);
      
      // Check if user is superadmin after login
      const userData = loginMutation.data;
      if (userData && userData.role !== "superadmin") {
        setLoginError("Access denied. Only SuperAdmin users can login here.");
        return;
      }
      
      setLocation("/");
    } catch (error) {
      setLoginError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-bold">SuperAdmin Login</CardTitle>
            <CardDescription>Enter your credentials to access SuperAdmin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                isLoading={loginMutation.isPending}
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero Side */}
      <div className="flex-1 bg-primary text-primary-foreground p-10 flex flex-col justify-center hidden md:flex">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">SuperAdmin Portal</h1>
          <p className="text-xl mb-8">Manage multiple labs, users, and subscriptions from a central dashboard.</p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Multi-Lab Management</h3>
                <p>Centralized control for all connected laboratory facilities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Subscription Management</h3>
                <p>Oversee billing, plans, and subscription status for all facilities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary-foreground/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">System Configuration</h3>
                <p>Configure global settings, integrations and system parameters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}