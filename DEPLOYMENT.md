# Deployment Guide for Cranium Mind Maps

This project is built with **Next.js**, **Supabase**, and **Hugging Face/OpenAI**. Follow these steps to deploy your application.

## 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL scripts found in the `supabase/migrations` folder (if any) or create the following tables in the SQL Editor:
   - `users`: `id (uuid, primary key)`, `email (text)`.
   - `maps`: `id (uuid)`, `user_id (uuid)`, `title (text)`, `source_name (text)`, `source_type (text)`, `original_text (text)`, `summary_mode (boolean)`.
   - `nodes`: `id (uuid)`, `map_id (uuid, foreign key)`, `parent_id (uuid, nullable)`, `title (text)`, `content (text)`, `summary (text)`, `color (text)`, `depth (int)`, `order_index (int)`, `ai_generated (boolean)`, `importance_weight (float)`, `position_x (int)`, `position_y (int)`.
   - `revision_sets`: `id (uuid)`, `map_id (uuid)`, `user_id (uuid)`, `type (text)`, `scope (text)`, `title (text)`, `items (jsonb)`.
3. Go to **Project Settings > API** and note your `Project URL` and `Anon Key`.
4. Go to **Settings > API** and find your `Service Role Key` (keep this secret!).
5. Go to **Storage** and create a public bucket named `documents`.

## 2. Environment Variables
On your hosting provider (e.g., Vercel), set the following environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.
- `HF_API_KEY`: Your Hugging Face API key.
- `HF_BASE_URL`: `https://api-inference.huggingface.co/v1` (or your preferred endpoint).
- `HF_MODEL`: `Qwen/Qwen2.5-72B-Instruct` (or any compatible OpenAI-like model).
- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://your-app.vercel.app`).

## 3. Deploy to Vercel
1. Push your code to GitHub (done).
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Add the Environment Variables from Step 2.
5. Click **Deploy**.

## 4. Handling Large Files (Timeout Fix)
The project is configured with `export const maxDuration = 60;` in the upload route. 
> [!IMPORTANT]
> To use a timeout longer than 10 seconds on Vercel, you need a **Vercel Pro** or **Enterprise** plan. On the free Hobby plan, the maximum is 10 seconds, which may cause 504 errors for very large documents (30+ pages).

If you are on the Hobby plan and experience timeouts, consider:
- Splitting large PDFs before uploading.
- Using a faster AI model.
- Reducing the sampling rate in `lib/openai.ts`.

## 5. Deployment on Hugging Face Spaces
Hugging Face Spaces is a great alternative because it has **no strict 10s timeout limit** like Vercel's free tier.

1. Create a new **Space** on [Hugging Face](https://huggingface.co/new-space).
2. Choose **Docker** as the SDK.
3. Select the **Blank** template or **Docker**.
4. Go to **Settings > Variables and Secrets**.
5. Add all your environment variables (the same ones used in Step 2) as **Secrets**.
6. Upload your code to the Space repo (or sync it from GitHub).
   - Use the provided `Dockerfile` in the root of the project.
   - The app will automatically build and run on port 7860.
7. Your app will be live at `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME`.

## 6. Automating Sync from GitHub to Hugging Face
To automatically deploy to Hugging Face whenever you push to GitHub:

1. **Get a Hugging Face Token**:
   - Go to [Hugging Face Settings > Access Tokens](https://huggingface.co/settings/tokens).
   - Create a new token with **Write** role.
2. **Add Secret to GitHub**:
   - Go to your GitHub repository **Settings > Secrets and variables > Actions**.
   - Click **New repository secret**.
   - Name: `HF_TOKEN`
   - Value: Paste your Hugging Face Write token.
3. **Verify Space Name**:
   - Ensure the name in `.github/workflows/hf_sync.yml` matches your Hugging Face Space URL.
4. **Push to GitHub**:
   - Once you push your changes, the GitHub Action will automatically sync the code to Hugging Face.

