import { motion } from 'framer-motion';
import { Plus, FileText, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { TranscriptionCard } from '@/components/TranscriptionCard';
import { useTranscriptions } from '@/hooks/useTranscriptions';

const Dashboard = () => {
  const { data: transcriptions = [], isLoading } = useTranscriptions();

  const stats = [
    {
      label: 'Total de Transcrições',
      value: transcriptions.length,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Esta Semana',
      value: transcriptions.filter(t => {
        const date = new Date(t.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date > weekAgo;
      }).length,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Em Processamento',
      value: transcriptions.filter(t => t.status === 'processing').length,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ];

  const recentTranscriptions = transcriptions.slice(0, 5);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao TubeLink
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link
            to="/new"
            className="glass-card p-6 flex items-center gap-4 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">Nova Transcrição</h3>
              <p className="text-muted-foreground">
                Cole um link do YouTube para começar
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Recent Transcriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Transcrições Recentes</h2>
            {transcriptions.length > 5 && (
              <Link to="/transcriptions" className="text-sm text-primary hover:underline">
                Ver todas
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          ) : recentTranscriptions.length > 0 ? (
            <div className="grid gap-4">
              {recentTranscriptions.map((transcription, index) => (
                <motion.div
                  key={transcription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <TranscriptionCard transcription={transcription} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma transcrição ainda
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira transcrição
              </p>
              <Link
                to="/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Transcrição
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
