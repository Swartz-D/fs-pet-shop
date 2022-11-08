const { json } = require('express');
const express = require('express');
const app = express();
const pets = require('./pets.json');
console.log(pets)
let homeMessage = `All pets in Pet Shop, go to 
"pets/[index]" for specific pet.`
app.disable('etag')
//get route(s)
app.get('/',(req,res)=>{
  console.log('/ route')
  res.send('Home page, go to "/pets"')
})

app.get('/pets',(req,res)=>{
  console.log('/pets route')
  res.send( homeMessage + JSON.stringify(pets))
})
app.get('/pets/:id', status,(req,res)=>{
    console.log(req.pet)
    res.send(req.pet)
  })
//create route
// app.post('/pets',(req,res)=>{
//     res.send({key: value})
//   })
//update route
// app
//   .route('/update')
//   .get((req,res)=>{
//     res.send()
//   })
//   .put((req,res)=>{
//     res.send()
//   })
//delete route
// app
//   .route('/delete')
//   .get((req,res)=>{
//     res.send()
//   })
//   .delete((req,res)=>{
//     res.send()
//   })
//functions
function status(req,res,next){
  req.pet===undefined ? res.status(404).set('Content-Type','text/plain').send('Not Found') : res.status(200).set('Content-Type','application/json')
  next()
}

//params
app.param('id',(req,res,next,id)=>{
  req.pet = pets[id]
  next()
})
//server listener
// app.listen(3000, ()=>{
//   console.log(`Pet Shop listening on port ${3000}`)
// })