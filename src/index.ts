import express from "express";
import { InMemoryStore } from "./InMemoryStore";


const app = express();

app.get("/" , (req : any, res: any) => {
    res.json("Hey there");
})


const store =  new InMemoryStore();



app.listen(8000, () => {
    console.log("Server is listening on the Port 8000");
});

