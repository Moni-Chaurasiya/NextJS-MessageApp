import { Message } from "../model/User";
export interface ApiResponse{
    error: string;
    user: ProfileUser;
    success:boolean;
    message:string;
    // isAcceptingMessage?:boolean
    isAcceptingMessage?: boolean | undefined;
    messages?:Array<Message>
}