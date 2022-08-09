import moment from "moment";

export function convertDateToRFC3339UTCZulu(
  dateTimeYYY_MM_DD_hh_mm_ss,
  lateDateTolerated = null
) {
  const momentDate = moment(dateTimeYYY_MM_DD_hh_mm_ss, "YYYY-MM-DD hh:mm:ss");
  let addDate = momentDate;
  if (
    lateDateTolerated !== null ||
    lateDateTolerated !== 0 ||
    lateDateTolerated !== "0"
  ) {
    addDate.add(Number(lateDateTolerated), "minutes");
    return `${addDate.utc().format()}`;
  }
  return `${momentDate.utc().format()}`;
}
