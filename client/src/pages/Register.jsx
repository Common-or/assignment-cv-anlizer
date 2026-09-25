import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input, Alert } from '../components/ui';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-14">
        <Card>
          <h1 className="text-xl font-bold">Create account</h1>
          <p className="mb-4 text-sm text-slate-500">Start analyzing your CV with AI.</p>
          {error && <Alert tone="red" className="mb-3">{error}</Alert>}
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button className="w-full" disabled={busy}>{busy ? 'Creating…' : 'Register'}</Button>
          </form>
          <p className="mt-3 text-sm text-slate-500">Have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
        </Card>
      </div>
    </div>
  );
}
