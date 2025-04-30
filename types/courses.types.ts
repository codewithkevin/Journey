export interface ICourse {
    id: string;
    category: "course";
    title: string;
    description: string;
    price: number;
    duration: string;
    level: string;
    postedDate: string;
    tutor: string;
    tags?: string[]
    coverImage?: string
}