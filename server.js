import app from "./src/app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns"
import Module from "./src/models/Module.js";


dns.setServers(["1.1.1.1","8.8.8.8"]); // dns was causing issues with MONGODB_CONNECTION, hence using this.

dotenv.config();


const port =  3000;

const ConnectDB_andStartserver  = async() =>
{
    try
    {
        await mongoose.connect(process.env.DB_STRING);
        console.log("DB connection successful!");

        
    // await Module.create(
    //     {
    //         name: "Test-Module-1",
    //         startQuestionId: new mongoose.Types.ObjectId("69ec8b902eba617d37f02c47")
    //     }
    // )
    
    // console.log("data seeding succesful!");

        app.listen(port, () =>
        {
            console.log(`server listening at PORT: ${port}`);
        });
    }
    catch(error)
    {
        console.error("DB Connection Error:", error);
        process.exit(1); // exit if DB fails
    }
}

ConnectDB_andStartserver();




