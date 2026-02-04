Quero que você crie um PRD completo e detalhado que eu usarei como prompt inicial no Lovable.

### PEDIDO DE PRD-Prompt (Lovable UI-First)

Este PRD deve ser pensado para ter alta performance dentro do Lovable e gerar telas, componentes, navegação e UX completos, sem backend neste momento.

A ideia é criar primeiro toda a interface — com dados fake e estado local, sem banco, sem autenticação e sem APIs — para depois validarmos a usabilidade e, em uma segunda etapa, conectar ao backend e ao n8n.

Use as instruções abaixo para estruturar o PRD Prompt.

---

### Estrutura do Projeto

1. Objetivo:

Quero criar um Aplicativo de transcrição dos vídeos do Youtube, onde o usuário poderá inserir o link do vídeo e receber a transcrição em texto. O App deve ter uma área para o usuário inserir o link do vídeo, um botão para iniciar a transcrição e uma área para exibir o texto transcrito.
Atenção: O Sistema precisa ser simples e funcional, não precisa deixar complexo

2. Funcionalidades principais:

- Dashboard inicial.
  - Todoas as transcrições feitas pelo usuário devem ser listadas aqui.
    - Cada transcrição deve mostrar o título do vídeo, a data da transcrição e um trecho do texto transcrito.
  - Botão para iniciar uma nova transcrição.
- Tela de nova transcrição.
  - Campo para inserir o link do vídeo do YouTube.
  - Botão para iniciar a transcrição.
- Tela de exibição da transcrição.
  - Exibir o texto transcrito do vídeo.
  - Botão para voltar ao dashboard.
  
- Meu Perfil
    - Informações da conta
    - Logout
    
3. Público-alvo:
Usuários que desejam obter transcrições de vídeos do YouTube para facilitar a leitura, estudo ou referência.

4. Estrutura de navegação:
- Dashboard 
- Minhas Transcrições
- Meu Perfil (em baixo)

5. Estilo e Design:
- Apenas dark mode 
- Interface clean e moderna com foco em legibilidade 
- Tipografia Inter - Menu lateral fixo 
- Uso de cards, gráficos responsivos e componentes shadcn/ui 
- Animações suaves 
- Ícones discretos (lucide) e layout espaçado
- Não colocar nenhum logo no nome oficial do App - Pode chamar de TubeLink

1. Sobre os Dados:
- Usar dados mock para simular - Crie para o usuário um perfil fake com nome, email e foto de perfil.
- Criar para o usuário uma lista fake de transcrições já feitas, com títulos de vídeos, datas e trechos de texto.

---### Instruções Finais
- Crie todas as telas e componentes necessários para o funcionamento do aplicativo conforme descrito.
- Incluir microinterações: toasts, empty states, loading states e atalhos de teclado quando fizer sentido.
- Use dados mock para preencher as telas e componentes.
- Foque na usabilidade e experiência do usuário.
- NÃO criar backend, tabelas ou APIs nesta etapa.

Tome o tempo que precisar para criar, sem pressa. Não deixe nenhuma fonte em negrito no PRD