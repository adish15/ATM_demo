const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const atm=require('./atm');
const denomination_calc=require('./denomination').denomination_cal;

mongoose.connect('Please enter your MongoDB URI', { useNewUrlParser: true }, { useUnifiedTopology: true });






// let atmBalance = notesArray.reduce((total,currentValue)=>{
//     return total+(currentValue.denomination*(currentValue.quantity))
// },0) 


//User Schema
const postSchema = mongoose.Schema({

    cardNumber: { type: String, required: true },
    pin: { type: Number, required: true },
    balance: { type: Number, required: true },
})




var entryModel = mongoose.model('Entry', postSchema);




//Only admin can create user
app.post('/createuser', async (req, res) => {

    let entry = await entryModel.find({ cardNumber: req.body.cardNumber });
    if (req.body.cardNumber === entry.cardNumber) {
        res.send("Card number already exists");
    }
    else {
        let entry = new entryModel({

            cardNumber: req.body.cardNumber,
            pin: req.body.pin,
            balance: req.body.balance
        })

        await entry.save();

        res.send(entry);
    }
})

//Bonus add balance functionality
// app.post('/addbalance', async (req, res) => {

    
//     let entry = await entryModel.findOne({ cardNumber: req.body.cardNumber, pin: req.body.pin });
//     if(!entry){
//         res.send("Details entered are wrong");
//         return;
//     }
//     entry.balance = Number(entry.balance) + Number(req.body.amount);
//     await entry.save();
//     res.send("Amount has been added. Your Current balance is " + entry.balance);
// })

app.post('/debitbalance', async (req, res) => {


    let entry = await entryModel.findOne({ cardNumber: req.body.cardNumber, pin: req.body.pin });
    if(!entry){
        res.send("Details entered are wrong");
        return;
    }
    const atmData=await atm.AtmModel.findOne({uid: 1});
    
    const notes=atmData.data;
    let atmBalance = 0;
    
    Object.entries(notes).forEach(([noteType, count])=>{
        atmBalance= atmBalance+ (Number(noteType)*Number(count));
    })

    if (atmBalance >= req.body.amount) {

        if (entry.balance >= req.body.amount) {
            try {
                const {userNotes, atmNotes} = denomination_calc(req.body.amount,(req.body.denomination || 0), notes);
                
                entry.balance = Number(entry.balance) - Number(req.body.amount);    //deducting from user balance
                atmBalance = atmBalance - req.body.amount;   //deducting from ATM balance
                await entry.save();

                await atm.AtmModel.findOneAndUpdate({uid:1}, {
                    data: atmNotes
                })

                res.send({
                    notesDispensed: userNotes,
                    message: "Money debited. Your current balance is " + entry.balance
                });

            } catch(err){
                res.status(403).send({
                    message: err.message
                });
            }
        }
        else {
            res.status(403).send({
                message: "Not sufficient balance in your account"
            });
        }
    }
    else {
        res.status(403).send({
            message: "ATM is not having currency with this amount."
        });
    }

})

app.get('/balancedetails', async (req, res) => {
    let entry = await entryModel.findOne({ cardNumber: req.body.cardNumber, pin: req.body.pin });
    if(!entry){
        res.send("Details entered are wrong");
        return;
    }
    res.send("Your total balance is " + entry.balance);
})

app.get('/', async (req, res) => {
    res.send("chlra");
})

app.listen(3000, console.log("server running"));
