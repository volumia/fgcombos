import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./databaseGeneratedTypes";

type SupabaseState = {
    user: User | null;
    session: Session | null;
    supabase: SupabaseClient<Database> | null;
}

export const userState: SupabaseState = $state({
    user: null,
    session: null,
    supabase: null
});