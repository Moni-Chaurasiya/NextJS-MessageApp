// import { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import bcrypt from "bcryptjs"
// import UserModel from "@/src/model/User"
// import dbConnect from "@/src/lib/dbConnect"
                             
// export const authOptions:NextAuthOptions={
//     providers:[
//         CredentialsProvider({
//             id: "credentials",
//             name: "credentials",
//             credentials: {
//                     email: { label: "Email", type: "text" },
//                     password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials:any):Promise<any>{
//               await dbConnect()
//               try {
//                  const user= await UserModel.findOne({
//                     $or:[
//                         {email:credentials.identifier},
//                         {username:credentials.identifier}
//                     ]
//                 })
//                 if(!user){
//                     throw new Error ('No user found with this email')
//                 }
//                 if(!user.isVerified){
//                     throw new Error('Please verify your account before login')
//                 }
//                 const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)

//                 if(isPasswordCorrect){
//                     return user
//                 }else{
//                     throw new Error('Incorect Password');
//                 }
//               } catch (err:any) {
//                 throw new Error(err)
                
//               }

//             }
//         })
//     ]
// }

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<any> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.email }],
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user; // Ensure `user` has the expected shape
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err.message || "Internal server error");
        }
      },
    }),
  ],
   callbacks:{
    async jwt({ token, user }) {
         if(user){
            token._id=user._id?.toString()
            token.isVerified=user.isVerified;
            token.isAcceptingMessages= user.isAcceptingMessages;
            token.username=user.username
         }
         return token
    },
    async session({ session,  token }) {
        if(token){
            session.user._id= token._id
            session.user.isVerified=token.isVerified
            session.user.isAcceptingMessages=token.isAcceptingMessages
            session.user.username= token.username
        }
        return session
      },
    },
  pages:{
    signIn: 'sign-in',
  },
  session:{
    strategy:"jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
