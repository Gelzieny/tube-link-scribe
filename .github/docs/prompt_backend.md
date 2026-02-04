# Prompt – Integração com Lovable Cloud (Backend)

## Objetivo:

Agora que a interface TubeLink esta pronta, conecte todo o sistema ao backend usando o Lovable Cloud  (https://docs.lovable.dev/features/cloud).
A meta é deixar o app funcional e persistente, criando estrutura de dados, autenticação, regras de segurança e ações CRUD completas — tudo de forma simples e eficiente.


## Instruções principais:
  1. Modelagem de dados:
    - Crie toda a modelagem de dados no Lovable Cloud com tabelas e campos necessário
    - Todos os IDs devem ser do tipo UUID
    - Estrutura sugerida:
      - users
        - id (UUID, PK)
        - name (text)
        - email (text, unique)
        - created_at (timestamp)
      - transcriptions
        - id (UUID, PK)
        - user_id (UUID, FK para users.id)
        - video_url (text)
        - video_title (text)
        - transcription_text (text)
        - created_at (timestamp)
              
  2. Autenticação:
    - Implementar sistema de autenticação de usuários usando Lovable Cloud Auth.
    - Permitir:
      * Cadastro
      * Login
      * Logout 
      * Reset de senha
    - Exigir login para acessar qualquer área do app.
    - Garantir que cada usuário só possa acessar seus próprios dados.

  3. Regras RLS e Policies
    - Ativar Row Level Security nas tabelas.
    - Criar policies para garantir que:
      - Apenas usuários autenticados possam acessar dados
      - Cada usuário só veja, crie, edite e delete seus próprios registros de transações.
      - Apenas usuários autenticados possam acessar dados.
    

  4. Ações CRUD:
    - Implementar ações CRUD completas
      - Create: Permitir que usuários criem novas transcrições.
      - Read: Permitir que usuários visualizem suas transcrições.
      - Update: Permitir que usuários editem suas transcrições.
      - Delete: Permitir que usuários excluam suas transcrições.
          
  5. Transcrição de Vídeos do YouTube (Google Gemini)       

    Para a transcrição dos vídeos do YouTube:
      - Utilizar a API do Google Gemini
      - A variável GOOGLE_API_KEY já está configurada em Secrets no Supabase/Lovable Cloud
      - Integrar o código de transcrição abaixo ao backend
      - O fluxo deve ser:
        1. Usuário envia a URL do vídeo do YouTube
        2. O backend processa o vídeo
        3. O texto transcrito é gerado via Gemini
        4. A transcrição é salva na tabela transcriptions, vinculada ao user_id
    Código base para transcrição:
      response = client.models.generate_content(
        model='models/gemini-2.5-flash-preview-05-20',
        contents=types.Content(
          parts=[
            types.Part(
              file_data=types.FileData(file_uri='   • Building with Gemini 2.0: Multimodal live ...  ')
            ),
            types.Part(text='Transcreva o vídeo completo')
          ]
        )
      )
      - As transcrições devem ser retornadas em texto simples
      - O texto retornado deve ser armazenado no campo transcription_text
      - O título do vídeo deve ser salvo em video_title
      - A URL original deve ser salva em video_url


Observações:
- Foco em simplicidade e segurança.
- Não criar lógica complexa nem relacionamentos desnecessários.
- Garantir que toda a estrutura esteja pronta para escalar facilmente no futuro.
- Ao final, o app precisa estar funcional com backend, autenticação, políticas e CRUD totalmente operacionais.