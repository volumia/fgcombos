import type { Moveset } from "@/moveTypes";

export const moveset: Moveset = {
    moves: [
        {
            name: "Light Punch",
            notation: "5L",
            baseDamage: 50,
            proration: 0.9
        },
        {
            name: "Medium Punch",
            notation: "5M",
            baseDamage: 70,
            proration: 0.8
        },
        {
            name: "Heavy Punch",
            notation: "5H",
            baseDamage: 110,
            proration: 0.6
        },
    ]
};