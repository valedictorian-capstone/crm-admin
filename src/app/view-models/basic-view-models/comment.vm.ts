import { CustomerVM, ProductVM } from '.';

export interface CommentVM {
    id: string;
    message: string;
    rating: number;
    customer: CustomerVM;
    product: ProductVM;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentCM {
    message: string;
    rating: number;
    customer: CustomerVM;
    product: ProductVM;

}

export interface CommentUM {
    id: string;
    message: string;
    rating: number;
    customer: CustomerVM;
    product: ProductVM;

}
