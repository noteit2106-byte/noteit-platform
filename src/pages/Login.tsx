import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Login() {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regSecurityQuestion, setRegSecurityQuestion] = useState('');
  const [regSecurityAnswer, setRegSecurityAnswer] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'security'>('email');
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  
  const { user, login, register, resetPassword, checkSecurityQuestion } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    setIsRegistering(true);

    // Validation
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match');
      setIsRegistering(false);
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long');
      setIsRegistering(false);
      return;
    }

    if (!regSecurityQuestion || !regSecurityAnswer) {
      setRegError('Security question and answer are required for account recovery');
      setIsRegistering(false);
      return;
    }

    try {
      // In a real app, this would call an API to register the user
      await register(regName, regEmail, regPassword, regStudentId, regSecurityQuestion, regSecurityAnswer);
      
      // Show success message
      setRegSuccess('Account created successfully! You can now log in.');
      
      // Reset form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegStudentId('');
      setRegSecurityQuestion('');
      setRegSecurityAnswer('');
      
    } catch (err) {
      setRegError('Failed to create account. Email may already be in use.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">NoteIt!</CardTitle>
          <CardDescription>Access your study notes anytime, anywhere</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Dialog open={resetDialogOpen} onOpenChange={(open) => {
                    setResetDialogOpen(open);
                    if (!open) {
                      // Reset the dialog state when closed
                      setResetStep('email');
                      setSecurityQuestion(null);
                      setSecurityAnswer('');
                      setForgotEmail('');
                      setForgotError(null);
                      setForgotSuccess(null);
                      setTempPassword(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="px-0 text-sm">Forgot Password?</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          {resetStep === 'email' && 'Enter your email address to start the password reset process.'}
                          {resetStep === 'security' && 'Answer your security question to reset your password.'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {forgotError && (
                          <Alert variant="destructive">
                            <AlertDescription>{forgotError}</AlertDescription>
                          </Alert>
                        )}
                        {forgotSuccess && (
                          <Alert className="bg-green-50 text-green-800 border-green-500">
                            <AlertDescription>{forgotSuccess}</AlertDescription>
                          </Alert>
                        )}
                        
                        {resetStep === 'email' && !tempPassword && (
                          <div className="space-y-2">
                            <Label htmlFor="forgotEmail">Email</Label>
                            <Input
                              id="forgotEmail"
                              type="email"
                              placeholder="email@example.com"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              required
                            />
                          </div>
                        )}
                        
                        {resetStep === 'security' && securityQuestion && !tempPassword && (
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded border">
                              <p className="font-medium text-sm">Security Question:</p>
                              <p className="text-sm mt-1">{securityQuestion}</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="securityAnswer">Your Answer</Label>
                              <Input
                                id="securityAnswer"
                                placeholder="Enter your answer"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                        
                        {tempPassword && (
                          <div className="space-y-4">
                            <Alert className="bg-blue-50 text-blue-800 border-blue-300">
                              <AlertDescription>
                                <div className="font-medium">Temporary Password Generated</div>
                                <p className="mt-1">Use this temporary password to log in:</p>
                                <p className="font-mono bg-blue-100 px-2 py-1 mt-2 rounded text-center">{tempPassword}</p>
                                <p className="text-xs mt-2">Please change your password after logging in.</p>
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        {resetStep === 'email' && !tempPassword && (
                          <Button 
                            onClick={async () => {
                              setForgotError(null);
                              setIsResetting(true);
                              
                              try {
                                const question = await checkSecurityQuestion(forgotEmail);
                                setSecurityQuestion(question);
                                setResetStep('security');
                              } catch (err) {
                                if (err instanceof Error) {
                                  setForgotError(err.message);
                                } else {
                                  setForgotError('An error occurred. Please try again.');
                                }
                              } finally {
                                setIsResetting(false);
                              }
                            }} 
                            disabled={isResetting || !forgotEmail}
                          >
                            {isResetting ? 'Checking...' : 'Continue'}
                          </Button>
                        )}
                        
                        {resetStep === 'security' && !tempPassword && (
                          <Button 
                            onClick={async () => {
                              setForgotError(null);
                              setIsResetting(true);
                              
                              try {
                                const newPassword = await resetPassword(forgotEmail, securityAnswer);
                                setTempPassword(newPassword);
                                setForgotSuccess('Password has been reset successfully.');
                              } catch (err) {
                                if (err instanceof Error) {
                                  setForgotError(err.message);
                                } else {
                                  setForgotError('An error occurred. Please try again.');
                                }
                              } finally {
                                setIsResetting(false);
                              }
                            }} 
                            disabled={isResetting || !securityAnswer}
                          >
                            {isResetting ? 'Resetting...' : 'Reset Password'}
                          </Button>
                        )}
                        
                        {tempPassword && (
                          <Button 
                            onClick={() => {
                              setResetDialogOpen(false);
                            }}
                          >
                            Close
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardFooter>
            </form>
            <div className="px-6 py-4 text-center text-sm">
              <p className="text-gray-500">Please enter your credentials to sign in</p>
            </div>
          </TabsContent>
          
          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="space-y-4 pt-4">
                {regError && (
                  <Alert variant="destructive">
                    <AlertDescription>{regError}</AlertDescription>
                  </Alert>
                )}
                {regSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-500">
                    <AlertDescription>{regSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="regName">Full Name</Label>
                  <Input
                    id="regName"
                    placeholder="John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regStudentId">Student ID</Label>
                  <Input
                    id="regStudentId"
                    placeholder="e.g., 2023CS001"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regConfirmPassword">Confirm Password</Label>
                  <Input
                    id="regConfirmPassword"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regSecurityQuestion">Security Question</Label>
                  <Input
                    id="regSecurityQuestion"
                    placeholder="Example: What is your mother's maiden name?"
                    value={regSecurityQuestion}
                    onChange={(e) => setRegSecurityQuestion(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regSecurityAnswer">Security Answer</Label>
                  <Input
                    id="regSecurityAnswer"
                    placeholder="Your answer (case insensitive)"
                    value={regSecurityAnswer}
                    onChange={(e) => setRegSecurityAnswer(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isRegistering}>
                  {isRegistering ? 'Creating Account...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>
            <div className="px-6 py-4 text-center text-sm">
              <p className="text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}