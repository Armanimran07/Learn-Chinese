-- ==========================================
-- CHINESE LEARNING APP - SUPABASE SCHEMA
-- ==========================================

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  streak_count INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create a profile automatically when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Books
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. Chapters
CREATE TABLE public.chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. Vocabulary
CREATE TABLE public.vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  meaning TEXT NOT NULL,
  part_of_speech TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  audio_url TEXT,
  difficulty INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. Grammar Notes
CREATE TABLE public.grammar_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples JSONB, -- Array of objects: { chinese: "", pinyin: "", english: "" }
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 6. Quizzes
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'multiple_choice', 'fill_blank'
  question TEXT NOT NULL,
  options JSONB, -- Array of strings for multiple choice
  correct_answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);


-- 7. User Progress (Chapters)
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress', -- 'locked', 'in_progress', 'completed'
  score INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, chapter_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 8. User Vocabulary Progress (Spaced Repetition tracking)
CREATE TABLE public.user_vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'learning', -- 'learning', 'learned'
  is_favorite BOOLEAN DEFAULT FALSE,
  next_review_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, vocabulary_id)
);

ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own vocab progress" ON public.user_vocabulary_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own vocab progress" ON public.user_vocabulary_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocab progress" ON public.user_vocabulary_progress FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Public access policies for Books, Chapters, Vocab, Grammar, Quizzes
-- Assuming these are public for all authenticated users to read
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Books are viewable by everyone" ON public.books FOR SELECT USING (true);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);

ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vocab is viewable by everyone" ON public.vocabulary FOR SELECT USING (true);

ALTER TABLE public.grammar_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Grammar is viewable by everyone" ON public.grammar_notes FOR SELECT USING (true);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (true);
