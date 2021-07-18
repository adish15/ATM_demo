// notesArrayAvailable = [{
//     denomination: 100,
//     quantity: 250
// },
// {
//     denomination: 200,
//     quantity: 125
// },
// {
//     denomination: 500,
//     quantity: 52
// },
// {
//     denomination: 2000,
//     quantity: 12
// }
// ]


exports.denomination_cal= (amount, denomination_sel, availableNotes)=>{
    index = -1;

    // 2012
    const notesObject = {
        10:0,
        20: 0,
        50: 0,
        100: 0,
        200: 0,
        500: 0,
        2000: 0
    }

    // Avaialable
    // {
    //     100: 250,
    //     200: 125,
    //     500: 52,
    //     2000: 12
    // },


    if(denomination_sel){
        denomination_sel = Number(denomination_sel);
        const den_notes = Math.floor(amount / denomination_sel);
        if(availableNotes[denomination_sel] && den_notes){
            if(availableNotes[denomination_sel]>den_notes){
                amount = amount - (den_notes*denomination_sel);
                notesObject[denomination_sel] = notesObject[denomination_sel]+ den_notes;
                availableNotes[denomination_sel] = availableNotes[denomination_sel] - den_notes;
            }
        }
    }

    const noteTypes = Object.keys(notesObject).sort((a,b)=>Number(b)-Number(a))

    
    for(let i=0; i< noteTypes.length && amount > 0;i++){
        const noteType = Number(noteTypes[i]);
        // 2000
        const den_notes = Math.floor(amount / noteType);
        
        if(availableNotes[noteType] && den_notes){
            if(availableNotes[noteType]>den_notes){
                amount = amount - (den_notes*noteType);
                notesObject[noteType] = notesObject[noteType]+ den_notes;
                availableNotes[noteType] = availableNotes[noteType] - den_notes;
            } else {
                amount = amount - (availableNotes[noteType]*noteType);
                notesObject[noteType] = notesObject[noteType]+availableNotes[noteType];
                availableNotes[noteType] = 0;
            }
        }
    }
    if(amount){
        let notesAvailArray = [];
        Object.keys(availableNotes).forEach(noteType=>{
            if(availableNotes[noteType]){
                notesAvailArray.push(noteType);
            }
        })
        throw new Error("Unable to dispense cash. Avaialable notes "+notesAvailArray.join(','));
    }
    return {
        userNotes:notesObject,
        atmNotes: availableNotes
    }
}



