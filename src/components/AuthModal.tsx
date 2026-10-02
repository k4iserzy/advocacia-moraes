import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Scale, 
  Mail
} from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim()) return;

    try {
      setIsSubmitting(true);
      const user = await storage.loginUser(loginEmail.trim(), loginPassword);
      if (user) {
        onLoginSuccess(user);
        onClose();
      } else {
        setErrorMsg('E-mail não encontrado. Você pode criar um novo cadastro na aba ao lado.');
      }
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'Não foi possível acessar o banco de dados.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim() || !email.trim()) return;

    try {
      setIsSubmitting(true);
      const newUser = await storage.registerUser(name.trim(), email.trim(), phone.trim(), cpf.trim(), password);
      onLoginSuccess(newUser);
      onClose();
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'Não foi possível concluir o cadastro.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 sm:p-7 text-slate-100 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-white">
            Moraes & Associados
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Acesso seguro para Clientes e Administração
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar com E-mail</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Novo Cadastro</span>
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-mail Cadastrado *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Senha *</label>
              <input type="password" required minLength={6} placeholder="Mínimo de 6 caracteres" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500" />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/40 leading-relaxed">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-950/50 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Acessando...' : 'Acessar Conta'}</span>
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Roberto Silveira"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-mail *</label>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefone</label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPF / CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Senha *</label>
              <input type="password" required minLength={6} placeholder="Mínimo de 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-950/50 transition-all mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Criando conta...' : 'Criar Conta e Continuar'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
