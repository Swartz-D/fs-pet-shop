const http = require('http');
const fs = require('fs');
const { regexpToText } = require('nodemon/lib/utils');
const port = 8000;



const server = http.createServer((req, res)=>{
  switch(req.method){
    case 'GET':
      let url = req.url.split('/');
      console.log('index',url[2]);
      let i = '/'+url[2];
      console.log('this is i', i);
      switch(req.url){
        default:
          res.writeHead(404, {'Content-Type':'text/plain'});
          res.write('Not Found');
          res.end();
          break;

        case '/pets':

          fs.readFile('pets.json', 'utf8', (err,data)=>{
            if(err){
              throw err;
            } else {
              const pets = JSON.parse(data);
              console.log(pets);
              var petsJSON = JSON.stringify(pets);
          res.writeHead(200, {'Content-Type':'application/json'});
          res.write(petsJSON)
          res.end();
      }})}}})
  

server.listen(port, (error)=>{
  if(error){
    console.log('something is wrong');
  }else{
    console.log(`server listening on port:${port}`);
  }
})