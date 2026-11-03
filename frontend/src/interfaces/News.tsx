import type { Image } from "./Image";
import type { User } from "./User";

export interface News {
    id?: number;
    title: string;
    image: Image;
    body: string;
    school?: string;
    author_name: string;
    author: User | null;
    link: string;
    slug: string;
    status: string;
    scheduleTo: Date | null;
    created_at: string;
    updated_at: string;
}
