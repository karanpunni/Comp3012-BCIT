import * as fs from "fs/promises";
import Clinic from "./Clinic";

export default class Map {
  private _mapData: any;
  private cmap: any;
  allclinics = {};
  currentIntake = 30;

  constructor(filename: string) {
    this._mapData = this.loader(filename);
  }

  private async loader(filename: string) {
    const data = await fs.readFile(filename, "utf-8");
    return JSON.parse(data);
  }

  async printMap() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const data = await this._mapData;

        const totalarr: any = [];
        const cities = Object.keys(data["city"]);
        cities.forEach((city) => {
          var blocks =
            data["city"][city]["households"].length +
            data["city"][city]["clinics"].length;

          const arr: string[] = new Array(blocks);
          // @ts-ignore
          data["city"][city]["households"].forEach((element) => {
            // console.log(element)
            if (this.isvacnated(element["inhabitants"])) {
              arr[element["blockNum"]] = "F";
            } else {
              arr[element["blockNum"]] = "H";
            }
          });
          // @ts-ignore
          data["city"][city]["clinics"].forEach((element) => {
            arr[element["blockNum"]] = "C";
          });

          //   console.log(arr);
          totalarr.push(arr);
        });
        console.log(this.prittier(totalarr));
        resolve();
        // console.log(totalarr)
      } catch (error) {
        reject(error);
      }
    });
  }

  private prittier(arr: any) {
    var maxlength = 0;
    var final = "";
    // @ts-ignore
    arr.forEach((element) => {
      if (element.length > maxlength) {
        maxlength = element.length;
      }
    });
    // @ts-ignore
    arr.forEach((element) => {
      if (element.length < maxlength) {
        const diff = maxlength - element.length;
        for (let index = 0; index < diff; index++) {
          element.push("X");
        }
      }
      final += element.toString() + "\n";
    });
    this.cmap = arr;
    return final;
  }

  private isvacnated(inhabitant: any) {
    var couttrue = 0;
    // @ts-ignore
    inhabitant.forEach((element) => {
      // console.log(element["isVaccinated"])
      if (element["isVaccinated"]) {
        couttrue++;
      }
    });
    // console.log(couttrue)
    if (couttrue == inhabitant.length) {
      return true;
    } else {
      return false;
    }
  }

  

  async registerForShots() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const data = await this._mapData;
        const cities = Object.keys(data["city"]);
        // console.log(this.cmap)
        // @ts-ignore
        for (let index = 0; index < this.cmap.length; index++) {
          for (let index2 = 0; index2 < this.cmap[index].length; index2++) {
            if (this.cmap[index][index2] == "H") {
              var Hindex = this.cmap[index].indexOf(this.cmap[index][index2]);
              // let test=["C","H","C","H","F"]
              var closestclinicindex = this.findClinic(
                Hindex,
                this.cmap[index]
              );

              var city = data["city"][cities[index]];
              var closestclinic = "";

              // @ts-ignore
              city["clinics"].forEach((element) => {
                // @ts-ignore
                if (this.allclinics[element.name] == undefined) {
                  // @ts-ignore
                  this.allclinics[element.name] = new Clinic(
                    element,
                    cities[index]
                  );
                }
                if (element["blockNum"] == closestclinicindex) {
                  closestclinic = element;
                }
              });

              // // @ts-ignore
              // if (this.allclinics[clinic.name] == undefined) {
              //   // @ts-ignore
              //   this.allclinics[clinic.name] = new Clinic(clinic);
              // }

              // // @ts-ignore
              // city["households"].forEach(elements => {
              //   if(elements["blockNum"]==Hindex){
              //     let house:[]=elements["inhabitants"]
              //     house.forEach(element => {
              //       if(element["isVaccinated"]==false){
              //         // console.log(element)
              //         // @ts-ignore
              //         (this.allclinics[clinic.name]).enqueue(element)
              //         var c= data["city"][cities[index]]["households"].elements
              //         console.log(c)
              //       }
              //       // console.log(element)
              //     });
              //   }
              // });
              for (let i = 0; i < city["households"].length; i++) {
                // console.log(city["households"][i])
                if (city["households"][i]["blockNum"] == Hindex) {
                  for (
                    let j = 0;
                    j < city["households"][i]["inhabitants"].length;
                    j++
                  ) {
                    if (
                      city["households"][i]["inhabitants"][j]["isVaccinated"] ==
                      false
                    ) {
                      if (
                        city["households"][i]["inhabitants"][j]["age"] <
                        this.currentIntake
                      ) {
                        // // @ts-ignore
                        // if (this.allclinics[closestclinic.name] == undefined) {
                        //   // @ts-ignore
                        //   this.allclinics[closestclinic.name] = new Clinic(closestclinic,cities[index]);
                        // }

                        // @ts-ignore
                        this.allclinics[closestclinic.name].enqueue(
                          city["households"][i]["inhabitants"][j]
                        );
                        data["city"][cities[index]]["households"][i][
                          "inhabitants"
                        ][j]["isVaccinated"] = true;
                      }
                      // console.log(data["city"][cities[index]]["households"][i]["inhabitants"][j])
                    }
                  }
                }
              }
            }
          }
        }
        this._mapData = data;
        resolve();
        // console.log(this.allclinics);
      } catch (error) {
        reject(error);
      }
    });
  }

  private findClinic(H: number, blocks: string[]) {
    var neartoUp = -1;
    var neartoDown = -1;
    for (let index = H; index < blocks.length; index++) {
      if (blocks[index] == "C") {
        neartoUp = index;
        // console.log(neartoUp)
        index = blocks.length;
      }
    }

    for (let index = H; index > -1; index--) {
      if (blocks[index] == "C") {
        neartoDown = index;
        // console.log(neartoDown)
        index = -1;
      }
    }
    var updis = 0;
    var downdis = 0;
    if (neartoUp > -1) {
      updis = neartoUp - H;
    }
    if (neartoDown > -1) {
      downdis = H - neartoDown;
    }

    if (updis != 0 && downdis == 0) {
      return neartoUp;
    }
    if (updis == 0 && downdis != 0) {
      return neartoDown;
    }
    if (updis != 0 && downdis != 0) {
      if (updis >= downdis) {
        return neartoUp;
      } else {
        return neartoDown;
      }
    }
  }
}
