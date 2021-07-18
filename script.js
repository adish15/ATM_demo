const mongoose=require('mongoose');
const atm=require('./atm');

mongoose.connect('mongodb+srv://adish:Oyebhai@104@cluster1.0b6kt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true });

async function saveData(){
    const findData = await atm.AtmModel.findOne({uid: 1});
    if(!findData){
        const atmData=new atm.AtmModel({
            data: {
                10:100,
                20:50,
                50:40,
                100: 250,
                200: 125,
                500: 52,
                2000: 10
            },
            uid: 1
        })
        
        
        atmData.save().then(()=>{
            console.log("data entered");
        })
    } else {
        console.log("Data already exists")
    }
}

saveData();
