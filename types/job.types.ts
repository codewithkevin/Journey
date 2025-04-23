export interface IJob {
    id: string;
    category: "job";
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    salary: string;
    postedDate: string;
    tags?: string[]
}