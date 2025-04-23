export interface IMentor {
    id: string;
    category: "mentorship";
    name: string;
    title: string;
    expertise: string[];
    bio: string;
    location: string;
    profileImage: string;
    rating: number;
    available: boolean;
    languages: string[];
    sessionsCompleted: number;
    tags?: string[]
}
