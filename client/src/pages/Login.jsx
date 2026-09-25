import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input, Alert } from '../components/ui';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      toast.success('Welcome back');
      navigate('/app');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-14">
        <Card>
          <h1 className="text-xl font-bold">Login</h1>
          <p className="mb-4 text-sm text-slate-500">Access your CV workspace.</p>
          {error && <Alert tone="red" className="mb-3">{error}</Alert>}
          <form onSubmit={submit} className="space-y-3">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button className="w-full" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</Button>
          </form>
          <p className="mt-3 text-sm text-slate-500">No account? <Link to="/register" className="text-indigo-600">Register</Link></p>
        </Card>
      </div>
    </div>
  );
}
