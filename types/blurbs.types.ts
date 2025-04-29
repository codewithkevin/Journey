export interface IBlurb {
    id: string;
    authorName: string;
    authorHandle: string;
    authorImageUrl: string;
    postedTime: string;
    message: string;
    mediaUrl: string;
    likeCount: number;
    reBlurbCount: number;
    viewCount: number;
    category: "blurbs";

    // Optional fields
    isOrganization?: boolean;
    verifiedBadge?: string;
}
