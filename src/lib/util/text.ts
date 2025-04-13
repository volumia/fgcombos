import { _ } from "svelte-i18n";
import { get } from "svelte/store";

export function profileNameOrDefault(name: string|undefined|null) {
    if (name) {
        return name;
    }
    else {
        return get(_)('user.noUserNameFound');
    }
}