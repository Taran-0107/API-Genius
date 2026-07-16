import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { gsap } from 'gsap';
import { apiFetch } from '@/helpers/Helper';
import { useAuth } from '@/AuthContext'; // Import the custom hook

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const password = watch('password');
  const { login } = useAuth(); // ✅ call useAuth() here, at top level

  useEffect(() => {
    // GSAP entrance animations
    gsap.set(['.signup-card', '.signup-bg'], { opacity: 0, y: 30 });
    
    const tl = gsap.timeline();
    tl.to('.signup-bg', { opacity: 1, duration: 0.8, ease: 'power2.out' })
      .to('.signup-card', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    console.log('Signup attempt:', data);
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username: data.name,email: data.email, password: data.password }),
      });

      console.log('signup successful:', response);

      const { access_token, user } = response;
      const token=access_token;
      console.log('Token:', token);
      login(token, user); // ✅ safe to use here

      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="signup-bg fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <Card className="signup-card bg-background/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2">
                API Genius
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join the future of API development
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="bg-background/50 border-white/10 focus:border-secondary/50 focus:ring-secondary/20"
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="bg-background/50 border-white/10 focus:border-secondary/50 focus:ring-secondary/20"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number'
                    }
                  })}
                  className="bg-background/50 border-white/10 focus:border-secondary/50 focus:ring-secondary/20"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="bg-background/50 border-white/10 focus:border-secondary/50 focus:ring-secondary/20"
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms"
                  {...register('terms', { required: 'You must accept the terms' })}
                  className="border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-secondary hover:text-secondary/80 transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-secondary hover:text-secondary/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-destructive text-sm">{errors.terms.message}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-white font-medium py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
              >
                Create Account
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="bg-background/30 border-white/10 hover:bg-background/50 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-background/30 border-white/10 hover:bg-background/50 transition-all duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-secondary hover:text-secondary/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;