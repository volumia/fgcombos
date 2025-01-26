import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./databaseGeneratedTypes";

type SupabaseState = {
    db: SupabaseClient<Database> | null;
    user: User | null;
    session: Session | null;
}

export const userState: SupabaseState = $state({
    user: null,
    session: null,
    db: null
});