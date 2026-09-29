import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

/**
 * Landing page for the link inside the verification email.
 * supabase-js reads the token straight out of the URL (detectSessionInUrl) and
 * creates a real session, so the visitor is already signed in here — we just
 * need to load their profile into the app's store and send them in.
 */
export default function EmailVerifiedPage() {
  const navigate = useNavigate();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [state, setState] = useState<'checking' | 'ok' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const queryParams = new URLSearchParams(window.location.search);
    const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
    if (errorDescription) {
      setMessage(errorDescription.replace(/\+/g, ' '));
      setState('error');
      return;
    }

    let cancelled = false;
    (async () => {
      // Give supabase-js a beat to parse the URL and store the session
      let session = (await supabase.auth.getSession()).data.session;
      for (let i = 0; i < 10 && !session; i++) {
        await new Promise((r) => setTimeout(r, 300));
        session = (await supabase.auth.getSession()).data.session;
      }
      if (cancelled) return;

      if (!session) {
        setMessage('This verification link is invalid or has expired.');
        setState('error');
        return;
      }

      await checkAuth();
      if (cancelled) return;
      setState('ok');
      setTimeout(() => !cancelled && navigate(ROUTES.DASHBOARD, { replace: true }), 1200);
    })();

    return () => {
      cancelled = true;
    };
  }, [checkAuth, navigate]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md">
        <CardContent className="py-10 text-center space-y-4">
          {state === 'checking' && (
            <>
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Verifying your email…</p>
            </>
          )}
          {state === 'ok' && (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold">Email verified</h1>
              <p className="text-sm text-muted-foreground">You're signed in. Taking you to your library…</p>
            </>
          )}
          {state === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <h1 className="text-2xl font-bold">Link problem</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
              <p className="text-sm text-muted-foreground">Sign in with your email and password — you can resend a new verification link from there.</p>
              <Button className="w-full" onClick={() => navigate(ROUTES.LOGIN)}>Go to sign in</Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
