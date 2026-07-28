"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 glass shadow-2xl border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2">
              HanziMaster
            </h1>
            <p className="text-muted-foreground">Sign in to sync your progress.</p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full py-6 text-base font-semibold bg-background hover:bg-background/80"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading !== null}
            >
              {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full py-6 text-base font-semibold bg-background hover:bg-background/80"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading !== null}
            >
              {isLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
