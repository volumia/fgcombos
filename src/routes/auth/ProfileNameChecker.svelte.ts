import type { TypedSupabaseClient } from '@/lib/supabase/databaseTypes';

export class ProfileNameChecker {
    private _supabase: TypedSupabaseClient;

    // I wish TS had syntactic sugar for combined private setters/public getters.
    // This is a lot of boilerplate
    private _valueMissing = $state(false);
    public get valueMissing() {
        return this._valueMissing;
    }

    private _tooShort = $state(false);
    public get tooShort() {
        return this._tooShort;
    }

    private _tooLong = $state(false);
    public get tooLong() {
        return this._tooLong;
    }

    private _patternMismatch = $state(false);
    public get patternMismatch() {
        return this._patternMismatch;
    }

    private _valid = $state(false);
    public get valid() {
        return this._valid;
    }

    private _initialValue = $state(true);
    public get initialValue() {
        return this._initialValue;
    }

    private _checking = $state(false);
    public get checking() {
        return this._checking;
    }

    private _performedAllChecks = $state(false);
    public get performedAllChecks() {
        return this._performedAllChecks;
    }

    constructor(supabase: TypedSupabaseClient) {
        this._supabase = supabase;
    }

    public async checkStatus(el: HTMLInputElement): Promise<void> {
        this._initialValue = false;
        this._performedAllChecks = false;

        const v = el.validity;
        this._valueMissing = v.valueMissing;
        this._tooShort = v.tooShort;
        this._tooLong = v.tooLong;
        this._patternMismatch = v.patternMismatch;

        // Check that the value is valid on the client-side first.
        // If it's already invalidated on the client then there's no point to checking again on the server.
        if (v.valueMissing || v.tooShort || v.tooLong || v.patternMismatch) {
            this._checking = false;
            return;
        }

        this._checking = true;

        const { data: isNameValid } = await this._supabase.rpc('is_profile_name_valid', {
            name: el.value
        });

        if (isNameValid) {
            this._valid = true;
            el.setCustomValidity('');
        } else {
            this._valid = false;
            el.setCustomValidity('name claimed');
        }

        this._checking = false;
        this._performedAllChecks = true;
    }
}

export function getCheckerCssClass(checker: ProfileNameChecker): string {
    if (checker.checking) {
        return 'val-checking';
    } else if (checker.valid) {
        return 'val-validated';
    } else if (!checker.valid) {
        return 'val-invalidated';
    } else {
        return '';
    }
}
