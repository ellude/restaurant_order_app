export interface Meal {
    key: number;
    description: string;
}

export interface Menu {
    time: string;
    dishes: Meal[];
}