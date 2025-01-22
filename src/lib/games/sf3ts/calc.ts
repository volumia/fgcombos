import type { Move, ComboResult } from "@/moveTypes";

export function resolveCombo(moves: Move[]): ComboResult {
    let result: ComboResult = {
        snapshots: [],
        totalDamage: 0
    };
    let multiplier = 1;

    moves.forEach((move) => {
        let damage = move.baseDamage * multiplier;
        result.totalDamage += damage;

        result.snapshots.push({
            id: move.id,
            baseDamage: move.baseDamage,
            proration: move.proration,
            multiplier,
            finalDamage: damage
        });

        multiplier *= move.proration;
    });

    return result;
}