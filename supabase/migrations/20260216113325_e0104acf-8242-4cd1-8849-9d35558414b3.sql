
-- Create storage bucket for barber content (profile photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('barber-content', 'barber-content', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to barber-content bucket
CREATE POLICY "Authenticated users can upload barber content"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'barber-content');

-- Allow public read access to barber content
CREATE POLICY "Public read access to barber content"
ON storage.objects FOR SELECT
USING (bucket_id = 'barber-content');

-- Allow authenticated users to update their barber content
CREATE POLICY "Authenticated users can update barber content"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'barber-content');

-- Allow authenticated users to delete barber content
CREATE POLICY "Authenticated users can delete barber content"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'barber-content');
