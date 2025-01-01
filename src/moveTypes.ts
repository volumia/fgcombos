export type Move = Readonly<{
    name: string;
    notation: string;
    baseDamage: number;
    proration: number;
}>;

export type Moveset = Readonly<{
    characterId: string,
    moves: Move[]
}>;

export type ComboSnapshot = {
    name: string;
    baseDamage: number;
    proration: number;
    multiplier: number;
    finalDamage: number;
};

export type ComboResult = {
    snapshots: ComboSnapshot[];
    totalDamage: number;
};