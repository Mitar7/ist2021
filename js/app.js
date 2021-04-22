const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const parser = require('xml2json');

app.use(cors());

app.use(express.json());

let proizvodi = [];

fs.readFile('proizvodi.xml', "utf-8", (greska,data) => { 
    if (greska) throw greska;
    const jsonFormat = JSON.parse(parser.toJson(data, {reversible: true}));
    proizvodi = jsonFormat;
  })

app.get('/', (req,res) => {
  if (!Array.isArray(proizvodi.proizvodi.proizvod)) res.send([proizvodi.proizvodi.proizvod]);
  else res.send(proizvodi.proizvodi.proizvod);
})

app.get('/:id', (req,res) => {
   if (!Array.isArray(proizvodi.proizvodi.proizvod)) res.send(proizvodi.proizvodi.proizvod);
   else res.send(proizvodi.proizvodi.proizvod.filter(x => x.id == req.params.id)[0]);
})


app.post('/dodaj', (req,res) => {
    const cenaAkcije = (parseInt(req.body.cena)*parseInt(req.body.akcija))/100;
    const proizvod = {
      id: (proizvodi.proizvodi.proizvod.length+1).toString(),
      kategorija: {$t: req.body.kategorija},
      cena: {valuta: "dinar", $t: req.body.cena},
      tekst: {$t: req.body.tekst},
      oznaka: {$t: req.body.oznaka},
      akcija: {cena: req.body.cena-cenaAkcije,datum_isteka: datum(),$t: req.body.akcija},
    };

    proizvodi.proizvodi.proizvod.push(proizvod);

    sacuvaj();
})

app.delete('/izbrisi/:id', (req,res) => {
  proizvodi.proizvodi.proizvod = proizvodi.proizvodi.proizvod.filter(x => x.id != req.params.id);

  sacuvaj();
})

app.patch('/edit/:id',(req,res) => {
  const id = req.params.id;
  const noviProizvod = req.body;
  const cenaAkcije = (parseInt(noviProizvod.cena)*parseInt(noviProizvod.akcija))/100;
  const proizvod = {
    id: id,
    kategorija: {$t: noviProizvod.kategorija},
    cena: {valuta: "dinar", $t: noviProizvod.cena},
    tekst: {$t: noviProizvod.tekst},
    oznaka: {$t: noviProizvod.oznaka},
    akcija: {cena: noviProizvod.cena-cenaAkcije,datum_isteka: datum(), $t: noviProizvod.akcija},
  };
 
  proizvodi.proizvodi.proizvod = proizvodi.proizvodi.proizvod.map(x => {
    if (x.id == id){
      return proizvod;
    }
    return x;
  });

  sacuvaj();
})

function sacuvaj(){
  const xml = parser.toXml(proizvodi,{reversible: true});
  const fullxml = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<!DOCTYPE proizvodi SYSTEM "pravila.dtd">' + xml;


  fs.writeFile('proizvodi.xml', formatXML(fullxml), greska => {
      if (greska) throw greska;
  }); 
}


function formatXML(input) {
  xmlString = input.trim()
      .replace(/>\s*</g,'>\n<')                   
      .replace(/(<[^\/>].*>)\n(<[\/])/g,'$1$2')      
      .replace(/(<\/[^>]+>|<[^>]+\/>)(<[^>]+>)/g,'$1\n$2');            
  xmlArr = xmlString.split('\n');

  var tabs = '';         
  var start = 0;          
  if (/^<[?]xml/.test(xmlArr[0])) start++;    

  for (var i = start; i < xmlArr.length; i++) { 
      var line = xmlArr[i].trim();    
      if (/^<[/]/.test(line)) {                
          tabs = tabs.replace(/.$/, '');
          xmlArr[i] = tabs + line;            
      } else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) {              
          xmlArr[i] = tabs + line;
      } else {                 
          xmlArr[i] = tabs + line;            
          tabs += '\t';
      }                    
  }

  return xmlArr.join('\n');
}

function datum() {
  let today = new Date();
  const dd = String(today.getDate()+10).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;
  return today;
}

app.listen(5000);