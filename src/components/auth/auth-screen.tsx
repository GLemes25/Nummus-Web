'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type AuthScreenProps = {
  onAuth: () => void;
};

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type AuthValues = z.infer<typeof authSchema>;

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthValues>({
    resolver: zodResolver(
      mode === 'signup'
        ? authSchema.extend({ name: z.string().min(2, 'Name must be at least 2 characters') })
        : authSchema,
    ),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1400));
    onAuth();
  };

  const isLoading = form.formState.isSubmitting;

  const handleModeSwitch = () => {
    form.reset();
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6">
      {/* Decorative left panel — desktop only */}
      <div
        className="hidden lg:flex flex-col justify-between w-115 min-h-150 rounded-2xl p-12 relative overflow-hidden mr-10 border border-border shrink-0"
        style={{ background: 'linear-gradient(145deg, #18181b 0%, #1a0d38 60%, #0d0622 100%)' }}
      >
        <div className="absolute -top-15 -right-15 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-50 h-50 rounded-full bg-[radial-gradient(circle,rgba(191,160,113,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(145deg, #BFA071, #8B6A40)', boxShadow: '0 4px 12px rgba(191,160,113,0.3)' }}
          >
            <span className="text-background font-extrabold text-lg leading-none">N</span>
          </div>
          <div>
            <div className="text-foreground font-semibold text-sm">Nummus Premium</div>
            <div className="text-gold text-[10px] tracking-[2px]">FINANCIAL ECOSYSTEM</div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-foreground mb-4 leading-tight text-3xl font-bold">
            Your complete
            <br />
            <span className="text-gold">financial ecosystem</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Track every transaction, manage multiple wallets, and get AI-powered insights to reach your financial goals faster.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '$2.4B', label: 'Tracked' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-gold font-bold text-2xl tracking-tight">{stat.value}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="bg-muted/50 border border-zinc-700 rounded-xl p-4">
          <p className="text-zinc-300 text-sm leading-relaxed mb-3">
            &ldquo;Nummus completely changed how I think about money. The AI insights are{' '}
            <span className="text-gold">incredible</span>.&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-foreground font-semibold shrink-0"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
            >
              SL
            </div>
            <div>
              <div className="text-foreground text-sm font-medium">Sarah L.</div>
              <div className="text-zinc-600 text-xs">Product Designer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth form card */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl p-10 w-full max-w-100"
      >
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-7">
          <div
            className="w-8.5 h-8.5 rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(145deg, #BFA071, #8B6A40)' }}
          >
            <span className="text-background font-extrabold text-sm">N</span>
          </div>
          <span className="text-foreground font-semibold">Nummus Premium</span>
        </div>

        <div className="mb-7">
          <h2 className="text-foreground mb-1.5 text-2xl font-bold">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === 'signin' ? 'Sign in to continue to your dashboard' : 'Start your financial journey today'}
          </p>
        </div>

        {/* Google button */}
        <Button type="button" variant="outline" className="w-full mb-6" onClick={onAuth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-zinc-700 text-xs">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-sm">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex Johnson" className="bg-background border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-sm">Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="alex@example.com" className="bg-background border-border text-foreground" {...field} />
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
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-zinc-400 text-sm">Password</FormLabel>
                    {mode === 'signin' && (
                      <Button type="button" variant="link" size="sm" className="text-brand p-0 h-auto text-xs">
                        Forgot password?
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="bg-background border-border text-foreground pr-11"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-600 hover:text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6">
          <span className="text-zinc-600 text-sm">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <Button type="button" variant="link" className="text-brand p-0 h-auto text-sm" onClick={handleModeSwitch}>
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
