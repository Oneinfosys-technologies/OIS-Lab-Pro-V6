import { useEffect, useState } from "react";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLocation } from "wouter";
import { LogoIcon } from "@/components/common/logo-icon";

export default function AuthPage() {
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="w-full md:w-1/2 bg-primary-50 dark:bg-primary-900/20 p-8 flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <LogoIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
          <Logo size="lg" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Advanced Lab Management Platform
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Book diagnostic tests, track your health, and access detailed reports with 
            AI-powered insights to better understand your health metrics.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="material-icons-round text-2xl text-primary-500 mb-2">schedule</div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Easy Booking</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Online or home collection</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="material-icons-round text-2xl text-primary-500 mb-2">insights</div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Smart Reports</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered health insights</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="material-icons-round text-2xl text-primary-500 mb-2">timeline</div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Real-time Tracking</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monitor test progress</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="material-icons-round text-2xl text-primary-500 mb-2">security</div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Secure Access</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Private & confidential</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to OIS LabPro</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
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
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("register")}
                      className="text-sm text-slate-500 dark:text-slate-400"
                    >
                      Don't have an account? Sign up
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Create a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("login")}
                      className="text-sm text-slate-500 dark:text-slate-400"
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-slate-500 dark:text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
