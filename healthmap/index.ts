import { ComplexReport } from "./ComplexReport";
import Map from "./Map";
import ReportMaker from "./ReportMaker";
import { SimpleReport } from "./SimpleReport";

async function main() {
  const map = await new Map("data.json");
  await map.printMap();
  console.log("---End of Map---");
  await map.registerForShots();
  const report = new ReportMaker(new ComplexReport(map));
  await report.printDetails();
  console.log("---End of Report---");
  await map.printMap();
  console.log("---End of Map---");
}

main();
