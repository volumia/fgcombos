<script lang="ts">
    import Icon from '@/lib/components/Icon.svelte';
    import { getProfileContext } from '@/lib/state/profileContext';
    import type { TypedSupabaseClient } from '@/lib/supabase/databaseTypes';
    import { _ } from 'svelte-i18n';
    import { bytesToKilobytes } from '$lib/util/math';
    import { Status, type StatusMessage } from '$lib/util/statusMessage';

    type Props = {
        uid: string;
        initDescription: string | null;
        supabase: TypedSupabaseClient;
        close: () => void;
    };

    const localProfile = getProfileContext();
    const { supabase, ...props }: Props = $props();

    let description = $state(props.initDescription);
    let publishing = $state(false);
    let uploadingAvatar = $state(false);
    let infoMessage: StatusMessage | undefined = $state();

    const maxAvatarSizeBytes = 100 * 1000;

    async function saveChanges() {
        publishing = true;

        const { data, error } = await supabase
            .from('profiles')
            .update({ description })
            .eq('id', props.uid)
            .select()
            .single();

        if (!error && localProfile != null) {
            localProfile.profile_name = data.profile_name;
            localProfile.description = data.description;
            props.close();
        }

        publishing = false;
    }

    async function uploadAvatar(e: Event) {
        if (localProfile == null) {
            return;
        }

        try {
            infoMessage = undefined;
            uploadingAvatar = true;

            const input = e.target as HTMLInputElement;

            if (!input.files || input.files.length === 0) {
                const msg = $_('user.edit.errorNoImage');
                infoMessage = { text: msg, type: Status.Error };

                throw new Error(infoMessage.text);
            }

            const file = input.files[0];
            if (file.size > maxAvatarSizeBytes) {
                const msg = $_('user.edit.errorAvatarTooLarge', {
                    values: { n: bytesToKilobytes(maxAvatarSizeBytes) }
                });

                displayErrorMessage(msg);

                throw new Error(msg);
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${localProfile?.id}/avatar.${fileExt}`;

            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .update(fileName, file, { upsert: true });

            if (uploadError) {
                displayErrorMessage(uploadError.message);
                throw uploadError;
            }

            const { error: updateProfileError } = await supabase
                .from('profiles')
                .update({ avatar_url: data.path })
                .eq('id', localProfile.id);

            if (updateProfileError) {
                displayErrorMessage(updateProfileError.message);

                throw updateProfileError;
            }

            displaySuccessMessage($_('user.edit.successUploadedAvatar'));
        } finally {
            uploadingAvatar = false;
        }
    }

    function displayErrorMessage(msg: string) {
        infoMessage = { text: msg, type: Status.Error };
    }

    function displaySuccessMessage(msg: string) {
        infoMessage = { text: msg, type: Status.Success };
    }
</script>

<div class="container">
    {#if uploadingAvatar}
        <p class="uploading">{$_('common.uploading')}</p>
    {:else}
        <label class="as-button btn-flex btn-small util-center-x">
            <input type="file" accept="image/*" onchange={uploadAvatar} disabled={uploadingAvatar} />
            <Icon src="/icons/upload.svg"></Icon>
            {$_('user.edit.uploadAvatar')}
        </label>
    {/if}


    <h2>{localProfile?.profile_name}</h2>

    <label for="description">{$_('user.yourDescription')}</label>
    <input
        type="text"
        id="description"
        name="description"
        autocomplete="off"
        bind:value={description}
    />

    <div class="actions">
        <button class="btn-small" onclick={() => props.close()} disabled={publishing || uploadingAvatar}>
            {$_('common.cancel')}
        </button>
    
        {#if publishing}
            <button class="btn-small" disabled>{$_('common.pending')}</button>
        {:else}
            <button class="btn-small" onclick={saveChanges}>{$_('common.save')}</button>
        {/if}
    </div>

    {#if infoMessage}
        {#if infoMessage.type == Status.Error}
            <p class="msg-error">{infoMessage.text}</p>
        {:else}
            <p class="msg-success">{infoMessage.text}</p>
        {/if}
    {/if}
</div>

<style lang="scss">
    @use '@/style/variables' as *;

    .container {
        width: 100%;
    }

    input {
        margin-bottom: $spacing-4;
    }

    input[type='file'] {
        display: none;
    }

    .actions {
        margin: $spacing-4 0;
    }

    .uploading {
        text-align: center;
    }

    .msg-error {
        font-size: $text-sm;
        color: $clr-red70;
        margin: $spacing-2 0;
    }

    .msg-success {
        font-size: $text-sm;
        color: $clr-green70;
        margin: $spacing-2 0;
    }
</style>
