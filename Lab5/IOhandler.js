/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const AdmZip = require("adm-zip"),
  fs = require("fs");
  const { createReadStream, createWriteStream } = require("fs");
const { readdir } = require("fs/promises");
const { Transform } = require("stream");
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    try{
      const zip = new AdmZip(pathIn)
      zip.extractAllTo(pathOut,true)
      resolve();
    }
    catch (error){
      reject(error)
    }
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir,"utf-8",(err, files)=>{
     
      if(err){reject(err);}
      else{
          data = files.filter(file => path.extname(file)===".png");
          // console.log(data)
          resolve(data)
      }
  })
  })
 
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve,reject)=>{
      // console.log(pathIn)
        fs.createReadStream("./unzipped/"+pathIn)

        .pipe(new PNG({
          filterType: 4,
        }))
        .on("error",reject)
        
        .on("parsed", function () {
            for (var y = 0; y < this.height; y++) {
              for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                var r= this.data[idx]
                var g = this.data[idx + 1]
                var b = this.data[idx + 2]

                var gray = (r+g+b)/3
              
                this.data[idx] = gray;
                this.data[idx + 1] = gray;
                this.data[idx + 2] = gray;

              }
            }
            const p = path.join(pathOut, pathIn); 
            console.log(p+" in")
            this.pack().pipe(fs.createWriteStream(p))
            .on("error",reject)
            .on("finish",resolve)
          }
      );

})

};


module.exports = {
  unzip,
  readDir,
  grayScale,
};
