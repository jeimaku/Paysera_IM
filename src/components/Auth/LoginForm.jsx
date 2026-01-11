import { useState } from 'react';
import { supabase } from '../../supabase/client';
import { getUserRole } from '../../auth/getUserRole';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError('Invalid login credentials');
      setLoading(false);
      return;
    }

    const role = await getUserRole(data.user.email);

    if (!role) {
      setError('Account role not found');
      setLoading(false);
      return;
    }

    // 🔁 ROLE-BASED REDIRECT
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'IT') navigate('/it');
    else navigate('/employee');

    setLoading(false);
  };

  return (
    <form className="login-card" onSubmit={handleLogin}>
      <h2>Inventory Management System</h2>

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
