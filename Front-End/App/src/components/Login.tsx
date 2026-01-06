import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Car, Lock, Mail, User, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBack?: () => void;
}

export default function Login({ onBack }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = await login(email, password);
      if (!success) {
        setError('Email atau password salah');
      }
    } else {
      const success = await register(name, email, password);
      if (success) {
        setIsLogin(true);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError('Email sudah terdaftar');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023EBA] via-blue-700 to-gray-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#023EBA] to-gray-700 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
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
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#023EBA] to-gray-700 text-white py-3 rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                {isLogin ? 'Masuk' : 'Daftar'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-[#023EBA] hover:text-[#022f8a]"
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 mb-2">Demo Akun:</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>👤 User: user@velon.com / user123</p>
                <p>👨‍💼 Admin: admin@velon.com / admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}