export class RevertableValue<T> {
    private _isEditing: boolean = $state(false);
    private _editingValue: T | undefined = $state();
    private _value: T | undefined = $state();

    constructor(defaultValue: T) {
        this._editingValue = defaultValue;
        this._value = defaultValue;
    }

    public get value(): T | undefined {
        if (this._isEditing) {
            return this._editingValue;
        } else {
            return this._value;
        }
    }

    public set value(val: T) {
        if (this._isEditing) {
            this._editingValue = val;
        }
    }

    public get isEditing(): boolean {
        return this._isEditing;
    }

    beginEdit() {
        this._isEditing = true;
        this._editingValue = this._value;
    }

    confirm() {
        this._isEditing = false;
        this._value = this._editingValue;
    }

    revert() {
        this._isEditing = false;
    }
}