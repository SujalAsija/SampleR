const express = require('express');
const app = express();
const port = process.env.port || 3000;
const fs = require('fs');
const path = require('path');
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
const multer = require('multer');
//*Mongoose :
const mongoose=require('mongoose');
const url='mongodb://127.0.0.1:27017/Mongoose';
mongoose.connect(url,({
    useNewUrlParser:true,
    useUnifiedTopology:true
})).then((result)=>{
    console.log('Mongoose is connected.....');
}).catch((err)=>{
    console.log(err);
})
const imagedata=require('./models/usermodel');

//*Multer =>
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/upload');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const imagename = `${file.originalname}`;
        return cb(null, imagename);
    }
}) 
const filter = (req, file, cb) => {
    //console.log(file.mimetype);
    const ext = file.mimetype.split('/')[1];
    if (ext == 'jpg'|| ext=='jpeg') {
        console.log(file.originalname);
        const pth=path.join(__dirname,`/public/upload/${file.originalname}`);
        console.log(pth);
        console.log(fs.existsSync(pth)); 
        if (!fs.existsSync(pth)) {
           
            return cb(null,true);
        }
        else{
            cb(new Error("already have file ExitSync",false));
        }
    }
    else {
        return cb(new Error('File not supported '), false);
    }
}
const upload = multer({ storage: storage, fileFilter: filter ,limits:1*1024});
app.get('/', (req, res) => {
    res.render('index', { mes: "File Upload" });
})
app.post('/upload', upload.single('profile'), (req, res) => {
    console.log('file save');
    res.send('file save sucessfull');
   // res.render('view', { mes: req.file.filename });
   const objdata={
    image:req.file.filename
   }
   const newdata=imagedata(objdata);
   newdata.save().then((result)=>{
    console.log(result+'pic save md');
    res.end();
   }).catch((err)=>{
    console.log(err);
   })
})
app.get('/show',(req,res)=>{
  imagedata.find({}).then((result)=>{
    res.render('view',{mes:result});
  })
}) 
app.listen(port, 
    () => {
    console.log(`Running the port no ${port}`);
})