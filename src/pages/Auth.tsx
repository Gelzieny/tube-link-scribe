import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Youtube, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter no mínimo 6 caracteres');

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'reset') {
      setMode('reset');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    if (mode !== 'forgot') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Por favor, confirme seu email antes de fazer login');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Cadastro realizado! Verifique seu email para confirmar.');
          setMode('login');
        }
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Email de recuperação enviado!');
          setMode('login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto mb-4">
            <Youtube className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">TubeLink</h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'login' && 'Entre na sua conta'}
            {mode === 'signup' && 'Crie sua conta'}
            {mode === 'forgot' && 'Recuperar senha'}
            {mode === 'reset' && 'Redefinir senha'}
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-card border-border"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className="pl-10 bg-card border-border"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className="pl-10 pr-10 bg-card border-border"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Entrar'}
                  {mode === 'signup' && 'Criar conta'}
                  {mode === 'forgot' && 'Enviar email'}
                  {mode === 'reset' && 'Redefinir senha'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' && (
              <>
                Não tem conta?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Cadastre-se
                </button>
              </>
            )}
            {(mode === 'signup' || mode === 'forgot') && (
              <>
                Já tem conta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Faça login
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
