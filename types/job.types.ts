export interface IJob {
    id: string;
    category: "job";
    jobTitle: string;
    company: string;
    isFullTime: boolean;
    experience: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    salary: string;
    postedDate: string;
    tags?: string[]
    postedTime?: string;
    profileImage?: string;
}