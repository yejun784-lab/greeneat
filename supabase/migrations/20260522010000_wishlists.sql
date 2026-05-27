-- wishlists: individual SELECT/INSERT/DELETE policies
-- (table + base policy created in 20260512000000_wishlist_allergens.sql)

DO $$ BEGIN
  CREATE POLICY "wishlists_select" ON wishlists FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "wishlists_insert" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "wishlists_delete" ON wishlists FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
