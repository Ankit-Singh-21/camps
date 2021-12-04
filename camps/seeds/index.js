const mongoose=require('mongoose')
const Campground = require('../model/camp');
const {descriptors,places}=require('./seedHelpers')
const loc=require('./cities')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
   
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

let arr=array => array[Math.floor(Math.random() * array.length)]
 


const create=async ()=>{
    const deletion= await Campground.deleteMany({});
    for(let i=0;i<5;i++){
        let rand=Math.floor(Math.random()*1000);
        let newa=new Campground({
            author:"6140522f804b70838c1a26cb",
            location:`${loc[rand].city} ${loc[rand].state}`,
            description:`${arr(descriptors)}`,
            title:`${arr(places)}`,
            image:"https://source.unsplash.com/collection/483251"
        })
        await newa.save();
    }
}

create().then(()=>{
    mongoose.connection.close();
})