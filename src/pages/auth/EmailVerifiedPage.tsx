import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { supabase } from '@/config/supabase';

/**
 * Landing page for the link inside the verification email.
 * Supabase adds the session (or an error) to the URL; the client picks it up automatically.
 */
export default function EmailVerifiedPage() {
  const [state, setState] = useState<'checking' | 'ok' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, '') + '&' + window.location.search.replace(/^\?/, ''));
    const errorDescription = params.get('error_description');
    if (errorDescription) {
      setMessage(errorDescription.replace(/\+/g, ' '));
      setState('error');
      return;
    }
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      void data; setState('ok');
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md">
        <CardContent className="py-10 text-center space-y-4">
          {state === 'checking' && <Loader2 className="w-10 h-10 mx-auto animate-spin text-muted-foreground" />}
          {state === 'ok' && (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold">Email verified</h1>
              <p className="text-sm text-muted-foreground">Your account is active. You can now browse, read and download books.</p>
              <Link to="/login?verified=1"><Button className="w-full">Continue to sign in</Button></Link>
            </>
          )}
          {state === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <h1 className="text-2xl font-bold">Link problem</h1>
              <p className="text-sm text-muted-foreground">{message || 'This verification link is invalid or has expired.'}</p>
              <p className="text-sm text-muted-foreground">Sign in with your email and password to request a new link.</p>
              <Link to="/login"><Button className="w-full">Go to sign in</Button></Link>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
