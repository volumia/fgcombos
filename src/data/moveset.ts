import type { Moveset } from "@/moveTypes";

export const moveset: Moveset = {
    moves: [
        {
            name: "Light Punch",
            notation: "5LP",
            baseDamage: 50,
            proration: 0.9
        },
        {
            name: "Medium Punch",
            notation: "5MP",
            baseDamage: 70,
            proration: 0.8
        },
        {
            name: "Heavy Punch",
            notation: "5HP",
            baseDamage: 110,
            proration: 0.6
        },
        {
            name: "Crouching Light Punch",
            notation: "2LP",
            baseDamage: 50,
            proration: 0.9
        },
        {
            name: "Crouching Medium Punch",
            notation: "2MP",
            baseDamage: 70,
            proration: 0.8
        },
        {
            name: "Crouching Heavy Punch",
            notation: "2HP",
            baseDamage: 110,
            proration: 0.6
        },
        {
            name: "Light Kick",
            notation: "5LK",
            baseDamage: 50,
            proration: 0.9
        },
        {
            name: "Medium Kick",
            notation: "5MK",
            baseDamage: 70,
            proration: 0.8
        },
        {
            name: "Heavy Kick",
            notation: "5HK",
            baseDamage: 110,
            proration: 0.6
        },
    ]
};