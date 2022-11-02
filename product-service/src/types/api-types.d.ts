export interface Product {
    id: string;
    price: number;
    title: string;
    description?: string;
    count?: number;
}

export interface Stock {
    id: string;
    productId: string;
    count: number;
}
