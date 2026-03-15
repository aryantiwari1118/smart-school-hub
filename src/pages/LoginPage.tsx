import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const roles = ["Admin", "Teacher", "Student", "Parent"] as const;

const TEST_CREDENTIALS: Record<string, { email: string; password: string }> = {
  Admin: { email: "admin@smartedu.com", password: "admin123" },
  Teacher: { email: "teacher@smartedu.com", password: "teacher123" },
  Student: { email: "student@smartedu.com", password: "student123" },
  Parent: { email: "parent@smartedu.com", password: "parent123" }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("Student");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showTestCredentials, setShowTestCredentials] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(emailOrMobile, password, selectedRole);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Logged in as ${response.user.name}`,
        });
        
        setTimeout(() => {
          const route = `/${selectedRole.toLowerCase()}`;
          navigate(route);
        }, 500);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (role: string) => {
    const creds = TEST_CREDENTIALS[role];
    setEmailOrMobile(creds.email);
    setPassword(creds.password);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6 animate-fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">SmartEdu</h2>
          <p className="text-lg text-muted-foreground">
            Smart Curriculum Activity & Attendance System for modern educational institutions
          </p>
          <div className="flex justify-center gap-4 pt-4">
            {["Attendance Tracking", "Curriculum Management", "Analytics"].map((f) => (
              <span key={f} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 shadow-none lg:shadow-sm lg:border animate-slide-up">
          <CardHeader className="text-center space-y-1">
            <div className="lg:hidden mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-2">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">{isRegister ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription>
              {isRegister ? "Register to get started" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Test Credentials Info */}
            {showTestCredentials && !isRegister && (
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="flex justify-between items-start">
                    <span>Use test credentials to login</span>
                    <button
                      type="button"
                      className="text-xs font-semibold hover:underline"
                      onClick={() => setShowTestCredentials(false)}
                    >
                      Hide
                    </button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Role Selector */}
            <Tabs value={selectedRole} onValueChange={setSelectedRole} className="mb-4">
              <TabsList className="grid w-full grid-cols-4">
                {roles.map((role) => (
                  <TabsTrigger key={role} value={role} className="text-xs sm:text-sm">
                    {role}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Test Credentials Buttons */}
            {showTestCredentials && !isRegister && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Quick Login:</p>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="text-xs py-1.5 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
                      onClick={() => fillTestCredentials(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" disabled={isLoading} />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email or Mobile</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter email or mobile number"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegister && (
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" placeholder="Confirm your password" disabled={isLoading} />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : `Sign In as ${selectedRole}`}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                disabled={isLoading}
              >
                {isRegister ? "Sign In" : "Register"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
