import { motion } from 'framer-motion';
import { FileText, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { TranscriptionCard } from '@/components/TranscriptionCard';
import { mockTranscriptions, mockUser } from '@/data/mockData';

const Dashboard = () => {
  const recentTranscriptions = mockTranscriptions.slice(0, 4);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-foreground">
            Olá, {mockUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta ao TubeLink
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Transcrições</p>
                <p className="text-2xl font-semibold text-foreground">{mockTranscriptions.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-semibold text-foreground">4</p>
              </div>
            </div>
          </div>

          <Link
            to="/new"
            className="glass-card p-5 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground group-hover:animate-pulse-glow">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nova</p>
                <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  Transcrição
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Transcriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Transcrições Recentes
            </h2>
            <Link
              to="/transcriptions"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Ver todas →
            </Link>
          </div>

          {recentTranscriptions.length > 0 ? (
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
              <p className="text-muted-foreground mb-6">
                Comece transcrevendo seu primeiro vídeo do YouTube
              </p>
              <Link
                to="/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
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
