const express = require('express');
const app = express();
const PORT = 3030;
const {Client} = require('pg');

const config = require('./config.json')["dev"];

app.use(express.json())
app.disable('etag');

const client = new Client({
  connectionString: config.connectionString,
});
client.connect();

app.use((req, res, next)=>{
  if(req.url.split('/')[3]<1){
    res.status(500).set('Content-Type','text/plain').send("Internal Server Error!")
  } else {
    next();
  }
})

app
  .route('/api/pets')
  .get((req,res)=>{
    client.query('SELECT * FROM pets')
    .then(result =>{
      res.status(200).set('Content-Type','application/json').send(result.rows);
  })
    //.catch(e => console.error(e.stack))
})
  .post((req,res,next)=>{
    let pet = req.body;
    let age = pet.age;
    let kind = pet.kind;
    let name = pet.name;
    if(age >= 0 && typeof kind == 'string' && typeof name == 'string'){
    client.query(`INSERT INTO pets (age, kind, name) 
    VALUES (${age}, '${kind}','${name}') RETURNING *`)
      .then(result =>{
        res.status(200).set('Content-Type','application/json').send(result.rows);
        })}else{
          next();
        }
  });
  
app
  .route('/api/pets/:id')
  .get((req,res,next)=>{
    client.query(`SELECT * FROM pets WHERE id = ${req.params.id}`)
    .then(result =>{
      if(result.rows.length > 0){
      console.log(result.rows.length)
      res.status(200).set('Content-Type','application/json').send(result.rows);
      }else{
        next();
      }
    })
})

//=========================== Will throw error unless all inputs are of correct data type ====================

  .patch((req,res,next)=>{
    let pet = req.body;
    let age = pet.age ??= null;
    let kind = pet.kind;
    let name = pet.name;
    if((age && typeof age != 'number')|| (kind && typeof kind != 'string') || (name && typeof name != 'string')){
      next();
    }else{
      client.query(`UPDATE pets SET kind = COALESCE(NULLIF('${kind}','undefined'), kind), name = COALESCE(NULLIF('${name}','undefined'), name), 
      age = COALESCE(${age}, age) WHERE id = ${req.params.id} RETURNING *`)
        .then(result =>{
        res.status(200).set('Content-Type','application/json').send(result.rows);
        })}
    })

//============== Will update valid inputs even if there are invalid inputs =======================

    // .patch((req,res,next)=>{
    //   let pet = req.body;
    //   let petAtt = [];
    //   if(pet.age && typeof pet.age === 'number') petAtt.push('age='+ pet.age)
    //   if(pet.name && typeof pet.name === 'string') petAtt.push("name='"+ pet.name + "'")
    //   if(pet.kind && typeof pet.kind === 'string') petAtt.push("kind='" + pet.kind + "'")
    //   if(petAtt.length>0){
    //       let query = `UPDATE pets SET ${petAtt.toString()} WHERE id = ${req.params.id} RETURNING *`;
    //       console.log(query);
    //         client.query(query)
    //           .then(result =>{
    //           res.status(200).set('Content-Type','application/json').send(result.rows);
    //           })
    //     }else{
    //       next();
    //       }
    //    })
   
   //============= Crashes when input type does not match database data type ===========

    // .patch((req, res, next)=>{
    //   let pet = req.body;
    //   let petArr = [];
    //   for(elements in pet){
    //     petArr.push(elements+"='"+pet[elements]+"'")
    //     console.log(petArr.toString())
    //     client.query(`UPDATE pets SET ${petArr.toString()} WHERE id = ${req.params.id} RETURNING *`)
    //     .then(result=>{
    //       res.status(200).set('Content_Type', 'application/json').send(result.rows)
    //     })
    //   }
    // })

  .delete((req,res,next)=>{
      client.query(`DELETE FROM pets WHERE id = ${req.params.id} RETURNING *`)
        .then(result =>{
          if(result.rows.length > 0){
          console.log(result.rows)
          res.status(200).set('Content-Type','application/json').send(result.rows)
        }else{
            next();
          }
    })
  })

app.use((req, res, next) => {
  console.log(req.params.id)
  res.status(404).set('Content-Type','text/plain').send("Not Found!")
})

app.listen(PORT, ()=>{
  console.log(`app running on port ${PORT}`)
})