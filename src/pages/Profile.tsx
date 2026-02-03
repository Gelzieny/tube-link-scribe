import { motion } from 'framer-motion';
import { Calendar, FileText, LogOut, Mail, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockUser, mockTranscriptions } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const Profile = () => {
  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!', {
      description: 'Até breve!',
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-semibold text-foreground">
            Meu Perfil
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 text-center mb-6"
        >
          <div className="relative inline-block mb-6">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20"
            />
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-card" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-1">
            {mockUser.name}
          </h2>
          <p className="text-muted-foreground">
            {mockUser.email}
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <div className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="text-foreground font-medium">{mockUser.name}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{mockUser.email}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10">
                <FileText className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total de Transcrições</p>
                <p className="text-foreground font-medium">{mockTranscriptions.length} transcrições</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="text-foreground font-medium">
                  {format(mockUser.createdAt, "d 'de' MMMM, yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full py-6 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair da Conta
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
