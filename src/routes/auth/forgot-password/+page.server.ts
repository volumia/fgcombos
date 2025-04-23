import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PUBLIC_URL_BASE } from '$env/static/public';

export const actions: Actions = {
    resetPassword: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${PUBLIC_URL_BASE}/auth/update-password/`
        });

        if (error) {
            console.error(error);
            redirect(303, '/auth/error');
        } else {
            redirect(303, '/auth/forgot-password/ok');
        }
    }
};
