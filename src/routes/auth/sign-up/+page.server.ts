import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
    signUp: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const profileName = formData.get('profileName') as string;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    profile_name: profileName
                }
            }
        });
        
        if (error) {
            console.error(error);
            redirect(303, '/auth/error');
        } else {
            redirect(303, '/');
        }
    }
};
