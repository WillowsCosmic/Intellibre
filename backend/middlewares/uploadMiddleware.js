import multer from "multer"
import path from "path"
import fs from "fs"

//create uploads directory if it doesnt exist
const uploadDir = "uploads";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,uploadDir);
    },
    filename: function(req,res,cb){
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
    
});

//check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const minetype = filetypes.test(file.minetype);
    
    if (minetype && extname){
        return cb(null,true);
    } else {
        cb("Error: Image Only!")
    }
}

//Initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 2 * 1024 *1024}, //2mb limit
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    },
}).single("coverImage"); //Field name

export default upload
