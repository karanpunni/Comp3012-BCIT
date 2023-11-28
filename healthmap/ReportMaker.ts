import { Report } from "./interfaces";

export default class ReportMaker {
  constructor(private report: Report) {}

  printDetails() {
    this.report.printDetails();
  }
}
