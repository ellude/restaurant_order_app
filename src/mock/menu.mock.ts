import { Menu } from "src/model/menu.model";

export const menuMock: Menu[] = [
    {
        time: 'morning',
        dishes: [
            { key: 1, description: 'eggs' },
            { key: 2, description: 'toast' },
            { key: 3, description: 'coffee' },
            { key: 4, description: 'Not Applicable' }
        ]
    },
    {
        time: 'night',
        dishes: [
            { key: 1, description: 'steak' },
            { key: 2, description: 'potato' },
            { key: 3, description: 'wine' },
            { key: 4, description: 'cake' }
        ]
    }
]