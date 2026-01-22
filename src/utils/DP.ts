// -- 🔥 كود SQL كامل لإنشاء الجداول الأساسية لمنصة تعليم العربية
// CREATE TABLE IF NOT EXISTS profiles (
//   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
//   name TEXT,
//   avatar_url TEXT DEFAULT '/default-avatar.png',
//   country TEXT,
//   birth_date DATE,
//   total_xp INTEGER DEFAULT 0,
//   time_spent integer DEFAULT 0
//   streak_days INTEGER DEFAULT 0,
//   last_active TIMESTAMPTZ DEFAULT NOW(),
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// -- 1️⃣ جدول الدروس (Lessons)
// CREATE TABLE IF NOT EXISTS lessons (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   title TEXT NOT NULL,
//   type TEXT NOT NULL, -- lesson, video, audio, etc
//   level TEXT NOT NULL DEFAULT 'A1', -- A1, A2, B1...
//   content JSONB, -- يمكن أن يحتوي على نصوص، صور، فيديوهات، أسئلة
//   duration INT, -- مدة الدرس بالدقائق
//   video_url TEXT,
//   audio_url TEXT,
//   prerequisites JSONB, -- دروس يجب أخذها قبل هذا الدرس
//   order_index INT DEFAULT 0,
//   tags TEXT[],
//   is_active BOOLEAN DEFAULT true,
//   estimated_xp INT DEFAULT 100,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// -- 2️⃣ جدول قواعد اللغة (Grammar Rules)
// CREATE TABLE IF NOT EXISTS grammar_rules (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
//   rule_name TEXT NOT NULL,
//   examples JSONB,
//   exceptions TEXT,
//   explanation TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// -- 3️⃣ جدول المفردات (Vocabulary)
// CREATE TABLE IF NOT EXISTS vocabulary (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
//   word TEXT NOT NULL,
//   translation TEXT NOT NULL,
//   pronunciation TEXT,
//   example_sentence TEXT,
//   audio_url TEXT,
//   word_type TEXT,

//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// -- 4️⃣ جدول تقدم الطالب (Student Progress)
// CREATE TABLE IF NOT EXISTS student_progress (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
//   lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
//   status TEXT DEFAULT 'pending', -- pending, in_progress, completed
//   score INT,
//   attempts INT DEFAULT 1,
//   is_favorite BOOLEAN DEFAULT false,
//   notes TEXT,
//   completed_items TEXT[] DEFAULT '{}'
//   started_at TIMESTAMPTZ DEFAULT NOW(),
//   completed_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE (profile_id, lesson_id)
// );

// -- 5️⃣ جدول الإنجازات (Achievements)
// CREATE TABLE IF NOT EXISTS achievements (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
//   badge_name TEXT NOT NULL,
//   badge_icon TEXT,
//   description TEXT,
//   earned_at TIMESTAMPTZ DEFAULT NOW(),
//   achievement_type TEXT,
//   xp_reward INT DEFAULT 0,
//   rarity TEXT DEFAULT 'common',
//   category TEXT,
//   progress_current INT DEFAULT 1,
//   progress_target INT DEFAULT 1,
//   is_notified BOOLEAN DEFAULT false,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );

// -- 6️⃣ جدول الاختبارات (Quizzes)
// CREATE TABLE IF NOT EXISTS quizzes (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   description TEXT,
//   question_count INT DEFAULT 10,
//   passing_score INT DEFAULT 70,
//   time_limit INT, -- بالدقائق
//   is_randomized BOOLEAN DEFAULT true,
//   show_results_immediately BOOLEAN DEFAULT true,
//   max_attempts INT DEFAULT 3,
//   is_active BOOLEAN DEFAULT true,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// create table favorites (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid not null references auth.users(id) on delete cascade,
//   item_id uuid not null,
//   item_type text not null check (item_type in ('word', 'grammar', 'sentence')),
//   created_at timestamp with time zone default now()
// );

// -- 7️⃣ جدول أسئلة الاختبارات (Quiz Questions)
// CREATE TABLE IF NOT EXISTS quiz_questions (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
//   question_type TEXT NOT NULL, -- multiple_choice, true_false, etc
//   question_text TEXT NOT NULL,
//   question_audio_url TEXT,
//   question_image_url TEXT,
//   options JSONB,
//   correct_answer TEXT NOT NULL,
//   explanation TEXT,
//   points INT DEFAULT 10,
//   difficulty TEXT DEFAULT 'medium',
//   order_index INT DEFAULT 0,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

// CREATE TABLE quiz_attempts (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
//   profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
//   attempt_number INT DEFAULT 1,
//   score INT,
//   correct_answers INT,
//   total_questions INT,
//   status TEXT DEFAULT 'in_progress',
//   started_at TIMESTAMPTZ DEFAULT NOW(),
//   completed_at TIMESTAMPTZ
// );

// CREATE TABLE quiz_answers (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
//   question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
//   selected_answer TEXT,
//   is_correct BOOLEAN,
//   time_spent INT,
//   answered_at TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE (attempt_id, question_id)
// );

// -- 8️⃣ Triggers لتحديث updated_at تلقائيًا
// CREATE OR REPLACE FUNCTION update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN
//   NEW.updated_at = NOW();
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// -- Apply trigger to all tables with updated_at
// DO $$
// DECLARE tbl TEXT;
// BEGIN
//   FOR tbl IN SELECT table_name 
//              FROM information_schema.tables 
//              WHERE table_schema='public' 
//                AND table_name IN ('lessons', 'grammar_rules', 'vocabulary', 'student_progress', 'achievements', 'quizzes', 'quiz_questions')
//   LOOP
//     EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', tbl, tbl);
//     EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
//   END LOOP;
// END $$;

// -- 9️⃣ Indexes للأداء
// CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
// CREATE INDEX IF NOT EXISTS idx_student_progress_profile_id ON student_progress(profile_id);
// CREATE INDEX IF NOT EXISTS idx_student_progress_lesson_id ON student_progress(lesson_id);
// CREATE INDEX IF NOT EXISTS idx_achievements_profile_id ON achievements(profile_id);
// CREATE INDEX IF NOT EXISTS idx_vocab_lesson_id ON vocabulary(lesson_id);
// CREATE INDEX IF NOT EXISTS idx_grammar_lesson_id ON grammar_rules(lesson_id);
// CREATE INDEX IF NOT EXISTS idx_quiz_lesson_id ON quizzes(lesson_id);
// CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);


