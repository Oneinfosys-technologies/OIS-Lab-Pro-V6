import { z } from "zod";
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { LogoIcon } from "@/components/common/logo-icon";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/hooks/use-auth";
import { LockIcon, AlertTriangle } from "lucide-react";

export default function SuperAdminLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Redirect if already logged in as superadmin
  if (user && user.role === "superadmin") {
    setLocation("/sa-dashboard");
    return null;
  }
  
  // Redirect if already logged in but not as superadmin
  if (user && user.role !== "superadmin") {
    setLocation("/");
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "You do not have permission to access the SuperAdmin area.",
    });
    return null;
  }
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoginError(null);
    
    try {
      const user = await loginMutation.mutateAsync(values);
      
      if (user.role !== "superadmin") {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to access the SuperAdmin area.",
        });
        setLoginError("This account does not have SuperAdmin privileges");
        
        // Logout the non-superadmin user
        setTimeout(() => {
          window.location.href = "/sa-login";
        }, 2000);
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back, SuperAdmin!",
      });
      
      setLocation("/sa-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid username or password");
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
      <div className="absolute top-4 left-4">
        <LogoIcon className="h-10 w-10" />
      </div>
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
              SuperAdmin Access
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Secure login for system administrators with elevated privileges
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <LockIcon className="h-5 w-5" />
                SuperAdmin Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the SuperAdmin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{loginError}</span>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="superadmin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm text-muted-foreground">
                <span>This area is restricted to authorized personnel only.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="hidden lg:flex flex-col justify-center">
          <div className="p-8 bg-primary/10 dark:bg-primary/5 rounded-2xl">
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Multi-Lab Management Platform</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The SuperAdmin dashboard provides centralized control over all labs in the system, 
              allowing you to manage subscriptions, monitor performance, and configure system-wide settings.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 dark:bg-primary/10 p-2 rounded-full">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium">Multi-Lab Management</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Oversee all labs from a centralized dashboard with detailed performance metrics
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 dark:bg-primary/10 p-2 rounded-full">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.75c.414 0 .75.336.75.75v.75m0 0H18a2.25 2.25 0 002.25-2.25V6.75m0 0h-2.25m0 0H3.75m0 0h2.25m0 0h13.5m0 0h2.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium">Subscription Management</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage subscription plans, renewals, and billing for all lab facilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/20 dark:bg-primary/10 p-2 rounded-full">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium">System Configuration</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Configure global settings, permissions, and integration parameters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}