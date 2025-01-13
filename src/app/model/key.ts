
export interface Key {
    id?: string;
    vehicles: Vehicle[];
    quantity?: number;
    type?: string;
    maker?: string;
    note?: string;
}

export interface Vehicle {
    make: string;
    model: string;
    trim: string;
    yearFrom: number;
    yearTo: number;
}