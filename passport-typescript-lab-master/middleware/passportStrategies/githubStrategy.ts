import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import {database, userModel} from "../../models/userModel"
import dotenv from "dotenv"
dotenv.config()

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },

    // async (req: Express.Request, accessToken: string, refreshToken: string, profile: any, done: (err: any) => void) 
    /* FIX ME 😭 */
    async (req: Express.Request, accessToken: string, refreshToken: string, profile: any, done: (err: any,user?:Express.User) => void) => {
       let data = {
            id: parseInt(profile.id),
            name: profile.username,
            email: profile.username,
            password: "",
            role:"user"
          }
          try{const userdata=userModel.findById(data.id)
            if(userdata){
              return done(null,userdata)
            }
          
          }
          catch(error){
            database.push(data)
            return done(null,data)
          }
            // console.log(database)
            
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
