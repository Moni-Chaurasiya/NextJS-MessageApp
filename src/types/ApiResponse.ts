// import { Message } from "../model/User";
// export interface ApiResponse{
//     error: string;
//     user: ProfileUser;
//     success:boolean;
//     message:string;
//     // isAcceptingMessage?:boolean
//     isAcceptingMessage?: boolean | undefined;
//     messages?:Array<Message>
// }

// In your ApiResponse interface file:
// Assuming ProfileUser is defined and exported in ../model/User

/*
import { Message, User } from "../model/User";

export interface ApiResponse {
    error: string;
    user?: User; // Now imported
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean | undefined;
    messages?: Array<Message>;
}
*/

import { Message,User } from "../model/User";
export interface ProfileUser {
    username: string;
    isAcceptingMessage: boolean;
  }
  
  export interface ApiResponse {
    success: boolean;
    message: string;
    error: string;
    user?: Partial<User>;
    messages?: Array<Message>;
    isAcceptingMessage?: boolean | undefined;
  }
  