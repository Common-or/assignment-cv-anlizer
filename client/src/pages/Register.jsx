import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Field, Input } from '../components/ui';
import { AuthShell, AuthFooterLink } from './AuthShell';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created');
      navigate('/app');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start analyzing your CV in under a minute."
      error={error}
      footer={<AuthFooterLink to="/login" prefix="Already have an account?" label="Sign in" />}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <Input placeholder="Jane Doe" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password" hint="Minimum 6 characters.">
          <Input type="password" placeholder="••••••••" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button className="w-full" size="lg" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</Button>
      </form>
    </AuthShell>
  );
}
