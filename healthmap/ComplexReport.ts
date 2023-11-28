import { Report } from "./interfaces";

export class ComplexReport implements Report {
  clinics = {};
  constructor(map: any) {
    this.clinics = map.allclinics;
  }
  async printDetails() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const data = await this.clinics;
        // console.log(data)
        const clinicname = Object.keys(this.clinics);
        clinicname.forEach((element) => {
          // @ts-ignore
          const time = data[element]["waittime"];

          // @ts-ignore
          const qu = data[element]["queue"];

          // @ts-ignore
          console.log(element);
          console.log(`Waittime: ${time} mins`);

          // @ts-ignore
          qu.forEach((person) => {
            console.log(person.fullName);
          });
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
