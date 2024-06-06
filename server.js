const express = require('express')
const app = express()
const cors = require("cors");
const port = 3000
const bodyParser = require('body-parser');
const { ocrSpace } = require('ocr-space-api-wrapper');
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(bodyParser.text({ limit: '200mb' }));
// app.get('/', (req, res) => {
//   testAPI();
// })

app.post('/',async (req, res) => {
  // console.log(req.body.type);
  // console.log(req.body.base64);
  var result=await testAPI(req.body.type, req.body.base64);
  
  res.send(result)

  
})
app.get('/', async (req, res) =>  {
res.send("Hello World");
})


app.listen(port, () => {
  
  console.log(`Example app listening on port ${port}`)
})

function keepNumber(str) {
  var num = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9' || str[i] == '.' || str[i] == ',') {
      num += str[i];
    }
  }
  return num;
}

async function testAPI (type, base64) {
  
  try {


    // Using your personal API key + local file
    const dataUrl= 'data:'+ type + ';base64,' + base64
    console.log(dataUrl);
    const res2 = await ocrSpace(dataUrl, { apiKey: 'K86555678188957', isTable: true, OCREngine: 2});
    
  
    console.log(res2.ParsedResults[0].ParsedText);
    console.log(res2.ParsedResults[0].TextOverlay);
    var listProduct = [];
    var listPrice = [];

    for (let i = 0; i < res2.ParsedResults[0].TextOverlay.Lines.length/2; i++) {
      var line = res2.ParsedResults[0].TextOverlay.Lines[i].LineText;
      listProduct.push(line);
    }

    for (let i = res2.ParsedResults[0].TextOverlay.Lines.length/2; i < res2.ParsedResults[0].TextOverlay.Lines.length; i++) {
      var line = res2.ParsedResults[0].TextOverlay.Lines[i].LineText;
      line = keepNumber(line);
      listPrice.push(line);
    }

    //merge 2 array to json
    var listProductPrice = [];
    for (let i = 0; i < listProduct.length; i++) {
      var obj = {
        product: listProduct[i],
        price: listPrice[i]
      }
      listProductPrice.push(obj);
    }


   
    // console.log(res2.ParsedResults[0].ParsedText);
    var newList = JSON.stringify(listProductPrice);
    console.log(newList);
    return newList;

  } catch (error) {
    console.error(error);
  }
}
