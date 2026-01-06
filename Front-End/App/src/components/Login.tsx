import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Car, Lock, Mail, User, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBack?: () => void;
}

export default function Login({ onBack }: LoginProps) {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Email atau password salah');
        }
      } else {
        const success = await register(name, email, password);
        if (success) {
          setMode('login');
          resetForm();
        } else {
          setError('Email sudah terdaftar');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023EBA] via-blue-700 to-gray-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#023EBA] to-gray-700 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <Car className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl mb-2">Velon</h1>
            <p className="text-blue-100">Rental Mobil Terpercaya</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-center text-gray-700 mb-6">
              {isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#023EBA] to-gray-700 text-white py-3 rounded-lg disabled:opacity-60"
              >
                {loading ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(isLogin ? 'register' : 'login');
                  resetForm();
                }}
                className="text-[#023EBA]"
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
