import { Rating } from './rating';

export class User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;

    phone_number: string;
    buyer_rating: Rating[];
    seller_ratings: Rating[];
}
