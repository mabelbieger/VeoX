/*
  # Criação do Schema VEOX

  1. Novas Tabelas
    - `users_profile`
      - `id` (uuid, chave primária, referência a auth.users)
      - `username` (text, nome de usuário)
      - `company_name` (text, nome da empresa/marca)
      - `company_area` (text, área de atuação)
      - `target_audience` (text, público alvo)
      - `plan_type` (text, tipo de plano: free, pro, business, enterprise)
      - `created_at` (timestamptz, data de criação)
      - `updated_at` (timestamptz, data de atualização)
    
    - `videos`
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência a auth.users)
      - `title` (text, título do vídeo)
      - `description` (text, descrição do vídeo)
      - `platform` (text, plataforma: tiktok, reels, shorts)
      - `objective` (text, objetivo da propaganda)
      - `target_audience` (text, público alvo)
      - `tone` (text, tom de comunicação)
      - `language` (text, idioma)
      - `duration` (integer, duração em segundos)
      - `status` (text, status: processing, completed, failed)
      - `video_url` (text, URL do vídeo gerado)
      - `thumbnail_url` (text, URL da thumbnail)
      - `created_at` (timestamptz, data de criação)
    
    - `analytics`
      - `id` (uuid, chave primária)
      - `video_id` (uuid, referência a videos)
      - `views` (integer, visualizações)
      - `likes` (integer, curtidas)
      - `comments` (integer, comentários)
      - `engagement_rate` (numeric, taxa de engajamento)
      - `date` (date, data da métrica)
      - `created_at` (timestamptz, data de criação)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados acessarem apenas seus próprios dados
*/

-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  company_name text,
  company_area text,
  target_audience text,
  plan_type text DEFAULT 'free' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de vídeos
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  platform text DEFAULT 'tiktok' NOT NULL,
  objective text,
  target_audience text,
  tone text,
  language text DEFAULT 'pt-BR',
  duration integer DEFAULT 30,
  status text DEFAULT 'processing',
  video_url text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- Criar tabela de analytics
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  engagement_rate numeric DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para users_profile
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para videos
CREATE POLICY "Usuários podem ver seus próprios vídeos"
  ON videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios vídeos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios vídeos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios vídeos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para analytics
CREATE POLICY "Usuários podem ver analytics de seus vídeos"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = analytics.video_id
      AND videos.user_id = auth.uid()
    )
  );

CREATE POLICY "Sistema pode inserir analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = analytics.video_id
      AND videos.user_id = auth.uid()
    )
  );