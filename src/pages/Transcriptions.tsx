import { motion } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TranscriptionCard } from '@/components/TranscriptionCard';
import { mockTranscriptions } from '@/data/mockData';
import { Input } from '@/components/ui/input';

const Transcriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTranscriptions = mockTranscriptions.filter((t) =>
    t.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Minhas Transcrições
          </h1>
          <p className="text-muted-foreground mt-1">
            {mockTranscriptions.length} transcrições no total
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título ou canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </motion.div>

        {/* Transcriptions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTranscriptions.length > 0 ? (
            <div className="grid gap-4">
              {filteredTranscriptions.map((transcription, index) => (
                <motion.div
                  key={transcription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <TranscriptionCard transcription={transcription} />
                </motion.div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="glass-card p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente buscar por outro termo
              </p>
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma transcrição ainda
              </h3>
              <p className="text-muted-foreground">
                Suas transcrições aparecerão aqui
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Transcriptions;
