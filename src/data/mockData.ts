import { Transcription, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos.silva@email.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date('2024-01-15'),
  transcriptionCount: 12,
};

export const mockTranscriptions: Transcription[] = [
  {
    id: '1',
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Como Criar uma Startup de Sucesso em 2024',
    videoThumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=320&h=180&fit=crop',
    channelName: 'Empreendedorismo Digital',
    transcriptionText: 'Olá pessoal, bem-vindos a mais um vídeo do canal. Hoje vamos falar sobre como criar uma startup de sucesso em 2024. Primeiro, é importante entender que o mercado mudou muito nos últimos anos. A tecnologia evoluiu rapidamente e com ela surgiram novas oportunidades de negócios. Vamos começar falando sobre a importância de validar sua ideia antes de investir tempo e dinheiro. Muitos empreendedores cometem o erro de desenvolver um produto completo sem antes testar se existe demanda real no mercado...',
    createdAt: new Date('2024-12-01'),
    duration: '15:32',
    status: 'completed',
  },
  {
    id: '2',
    videoId: 'abc123xyz',
    videoTitle: 'Inteligência Artificial: O Guia Completo para Iniciantes',
    videoThumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=320&h=180&fit=crop',
    channelName: 'Tech Academy Brasil',
    transcriptionText: 'A inteligência artificial está transformando o mundo como conhecemos. Neste vídeo, vamos explorar os conceitos fundamentais de IA, desde machine learning até redes neurais. Você vai aprender como essas tecnologias funcionam por trás dos bastidores e como elas estão sendo aplicadas em diversos setores da economia. Começaremos com uma breve história da IA, desde os primeiros conceitos teóricos até os avanços mais recentes...',
    createdAt: new Date('2024-11-28'),
    duration: '22:45',
    status: 'completed',
  },
  {
    id: '3',
    videoId: 'def456uvw',
    videoTitle: 'Produtividade: 10 Hábitos que Mudaram Minha Vida',
    videoThumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=320&h=180&fit=crop',
    channelName: 'Desenvolvimento Pessoal',
    transcriptionText: 'Fala galera, tudo bem? Hoje eu vou compartilhar com vocês os 10 hábitos que transformaram completamente minha produtividade. São práticas simples que qualquer pessoa pode implementar no dia a dia. O primeiro hábito é acordar cedo. Eu sei que muita gente reclama disso, mas acordar às 5 da manhã me deu horas extras de foco sem distrações. O segundo hábito é fazer exercícios logo pela manhã...',
    createdAt: new Date('2024-11-25'),
    duration: '18:20',
    status: 'completed',
  },
  {
    id: '4',
    videoId: 'ghi789rst',
    videoTitle: 'React em 2024: Novidades e Boas Práticas',
    videoThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop',
    channelName: 'Dev JS Brasil',
    transcriptionText: 'E aí desenvolvedores, beleza? Nesse vídeo vamos explorar as novidades do React em 2024. Vamos falar sobre Server Components, Suspense, e as novas APIs que estão mudando a forma como construímos aplicações. Também vou mostrar alguns exemplos práticos de código para vocês entenderem melhor como implementar essas features no dia a dia. Vamos começar pelo React Server Components...',
    createdAt: new Date('2024-11-20'),
    duration: '25:10',
    status: 'completed',
  },
  {
    id: '5',
    videoId: 'jkl012mno',
    videoTitle: 'Marketing Digital: Estratégias que Funcionam',
    videoThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=180&fit=crop',
    channelName: 'Marketing Masters',
    transcriptionText: 'Bem-vindos ao nosso canal! Hoje vamos mergulhar nas estratégias de marketing digital que realmente funcionam em 2024. Vou compartilhar cases reais de clientes que conseguiram aumentar suas vendas em mais de 300% usando as técnicas que vou ensinar aqui. A primeira estratégia é o marketing de conteúdo. Criar conteúdo de valor é fundamental para atrair e engajar seu público-alvo...',
    createdAt: new Date('2024-11-15'),
    duration: '20:55',
    status: 'completed',
  },
  {
    id: '6',
    videoId: 'pqr345stu',
    videoTitle: 'Python para Data Science: Primeiros Passos',
    videoThumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=320&h=180&fit=crop',
    channelName: 'Data Science Academy',
    transcriptionText: 'Olá, tudo bem? Se você está começando na área de data science, esse vídeo é para você. Vamos aprender os fundamentos de Python voltados para análise de dados. Começaremos instalando o ambiente de desenvolvimento, depois vamos explorar as bibliotecas essenciais como Pandas, NumPy e Matplotlib. Ao final deste vídeo, você já vai conseguir fazer suas primeiras análises de dados...',
    createdAt: new Date('2024-11-10'),
    duration: '32:15',
    status: 'completed',
  },
];

export const getVideoIdFromUrl = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
