import express,{Request,Response} from "express";
const app = express();
const PORT = 8000


app.get('/test',(req :Request,res :Response) :void=>{
    res.json({data: "testing pgdgage"})
})
app.listen(PORT,():void => {
    console.log(`Server is running on this port ${PORT}`);
})