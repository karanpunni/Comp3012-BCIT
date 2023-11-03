export {}

declare global{
    namespace Express{
        export interface User{
            id:number;
            name:string;
            email:string;
            password:string;
            role:string;
            
        }
    }

        namespace NodeJS {
        export interface ProcessEnv {
          CLIENT_ID: string;
          CLIENT_SECRET: string;
         
        }
      }
}


