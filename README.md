# StudyNotes App

StudyNotes is a Next.js app designed to help students and note-takers save time. Users upload screenshots or photos of lecture slides, textbooks, whiteboards, or handwritten notes, and AI turns them into structured, easy-to-read notes. The app also supports user authentication and persistent storage with Supabase, so notes can be saved, edited, and deleted.

## 🚀 Main Goal

Help busy students and note-takers convert image-based content into structured study notes quickly:

- Upload screenshot or photo
- AI extracts and organizes text into clearly labeled sections
- Save editable notes to a personal account
- Delete notes when finished

## ✨ Features

- Image upload (drag & drop / browse)
- AI note generation via API (`/api/process-image` + Google Gemini by default)
- JSON note model with `title` and `sections`
- Section types: concept, definition, formula, example, keypoint, summary
- User auth (sign up / sign in / sign out) via Supabase
- Notes persistence in Supabase `notes` table
- Edit and delete note items
- Responsive, modern UI (cards, transitions, feedback)

## 🗂️ Project Structure

- `app/page.jsx`: main app UI and feature flow
- `components/Auth.jsx`: authentication form component
- `components/EditNote.jsx`: note edit modal
- `components/ui/*`: Site widget components (cards, loader, upload, etc.)
- `hooks/useStudyNotes.js`: core app state and Supabase logic
- `lib/supabase.js`: Supabase client builder
- `utils/constants.js`: shared constants and style mapping
- `app/api/process-image/route.js`: AI text extraction endpoint

## 🧩 Setup

1. Clone repo and install deps:

```bash
npm install
```

2. Copy example `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

3. Set variables (your own values):

- `GOOGLE_AI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Create Supabase table:

```sql
create table notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  title text,
  sections jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS policy
alter table notes enable row level security;

create policy "Users can manage own notes" on notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

5. Start development:

```bash
npm run dev
```

6. Open browser: `http://localhost:3000`

## 🔐 Authentication

- Uses Supabase auth (`signUp`, `signIn`, `signOut`)
- Auth state is persisted in local browser session
- Only logged-in users can sync notes to DB

## 🧪 Build & Check

```bash
npm run lint
npm run build
```

## 🛠️ Customization

- Add support for any image AI provider by editing `app/api/process-image/route.js`
- Add richer note fields (tags, course, category) in `notes` schema + UI
- Add filtering / searching in sidebar list

## 💡 Notes for reviewers

This repo is structured for clean separation and team collaboration. The entire app is client-centric with a single hook driver, reusable UI components, and a clear data flow from upload → process → local state → Supabase.

## 📄 License

MIT
