import { Report } from "./interfaces";

export class SimpleReport implements Report {
  clinics = {};
  constructor(map: any) {
    this.clinics = map.allclinics;
    // console.log(this.clinics)
  }
  async printDetails() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const data = await this.clinics;
            // console.log(data)
            const clinicname = Object.keys(this.clinics);
            clinicname.forEach((element) => {
              // @ts-ignore
              const qu = data[element]["queue"];
              const numpeople=qu.length
              if (numpeople > 0) {
                // @ts-ignore
                console.log(element);
              }
              // @ts-ignore
              qu.forEach((person) => {
                console.log(person.fullName);
              });
            });
            resolve()
            
        } catch (error) {
            reject(error)
        }
    })
   
  
  }
}
