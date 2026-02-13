-- Allow all authenticated users to read plan features (marketing/pricing data, not sensitive)
CREATE POLICY "Anyone can view plan features"
ON public.plan_features
FOR SELECT
USING (true);