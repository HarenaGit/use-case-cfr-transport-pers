export default function exportJsonToFile(cfr) {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(cfr)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "scenarioCFR.json";
  link.click();
}
