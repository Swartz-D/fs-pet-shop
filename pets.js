#!/usr/bin/env node

var fs = require('fs');
let newPet = {
  age: parseInt(process.argv[3]), 
  kind: process.argv[4], 
  name: process.argv[5] 
}

let updatePet = {
  age: parseInt(process.argv[4]), 
  kind: process.argv[5], 
  name: process.argv[6] 
}

function outOfBounds(){
  console.error("Usage: node pets.js read INDEX");
  process.exit(1);
}

function wrongParam(){
    console.error('Usage: node pets.js create AGE KIND NAME');
    process.exit(1);
  }

function wrongUpdate(){
  console.error('Usage: node pets.js update INDEX AGE KIND NAME');
  process.exit(1);
}

function wrongDestroy(){
  console.error('Usage: node pets.js destroy INDEX');
  process.exit(1);
}

  function readSwitch(i,pets){
   // let i = process.argv[3];
    switch (process.argv[3]){
      case undefined:
        console.log(pets);
        break;
      case i:
        console.log(pets[i]);
        break;
    }
  }





fs.readFile('pets.json', 'utf8', (err,data)=>{
  if(err){
    throw err;
  } else {
    let i = process.argv[3];
      const pets = JSON.parse(data);
      switch (process.argv[2]){
        default:
          console.error ('Usage: node pets.js [read | create | update | destroy]')
          process.exit(1);
          break;
        case 'read':
          //console.log(pets)
          //let i = process.argv[3];
          if(i<0||i>=pets.length){
            outOfBounds();
            } else {
              readSwitch(i,pets);
              // switch (process.argv[3]){
              //   case undefined:
              //     console.log(pets);
              //     break;
              //   case i:
              //     console.log(pets[i]);
              //     break;
              // }
            }
            break;
          case 'create':
            if(process.argv.length!==6){
              wrongParam();
            } else {
              pets.push(newPet);
              console.log(pets)
              fs.writeFile('pets.json', JSON.stringify(pets), function(err){
                if(err) throw err;
                console.log('Saved');
              })
            }
          case 'update':
            if(process.argv.length!==7){
              wrongUpdate();
            } else {
              pets[i] = updatePet;
              console.log(updatePet)
              fs.writeFile('pets.json', JSON.stringify(pets), function(err){
                if(err) throw err;
                console.log('Saved');
              })
            }
            break;
          case 'destroy':
            if(process.argv.length!==4){
              wrongDestroy();
            } else {
              pets.splice(i, 1);
              fs.writeFile('pets.json', JSON.stringify(pets), function(err){
                if(err) throw err;
                console.log('Saved');
              })
            }
            break;

}
      
  }
});
