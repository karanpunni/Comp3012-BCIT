const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath,pathUnzipped)
.then(() => IOhandler.readDir('./unzipped'))
.then((data) => {Promise.all[IOhandler.grayScale(data[0],pathProcessed),IOhandler.grayScale(data[1],pathProcessed),IOhandler.grayScale(data[2],pathProcessed)]})
.then(()=>console.log("GrayScale conversion Complete"))
.catch((err)=>console.log(err))
