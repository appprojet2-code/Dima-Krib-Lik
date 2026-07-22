-- ============================================================
-- Bucket Supabase Storage "articles" — photos produits
-- (upload depuis BOArticles.tsx / BOStock.tsx : galerie ou appareil photo)
-- Policies permissives sur storage.objects pour ce bucket, coherentes
-- avec le reste du projet (authentification custom applicative, pas
-- Supabase Auth — impossible de desactiver RLS globalement sur ce
-- schema systeme, donc policies dediees au bucket "articles").
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "articles_public_read" ON storage.objects;
CREATE POLICY "articles_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'articles');

DROP POLICY IF EXISTS "articles_public_insert" ON storage.objects;
CREATE POLICY "articles_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'articles');

DROP POLICY IF EXISTS "articles_public_update" ON storage.objects;
CREATE POLICY "articles_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'articles');

DROP POLICY IF EXISTS "articles_public_delete" ON storage.objects;
CREATE POLICY "articles_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'articles');
