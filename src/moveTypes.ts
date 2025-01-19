export type Move = Readonly<{
    id: string;
    baseDamage: number;
    proration: number;
    category: string;
}>;

export type Moveset = Readonly<{
    moves: Move[];
}>;

export type ComboSnapshot = {
    id: string;
    baseDamage: number;
    proration: number;
    multiplier: number;
    finalDamage: number;
};

export type ComboResult = {
    snapshots: ComboSnapshot[];
    totalDamage: number;
};
