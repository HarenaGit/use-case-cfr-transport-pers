import { randomGeo, randomIntFromInterval } from "./dependeciesFunction";

export default function generateShipments(
  employesLength,
  companyLocation,
  radius,
  durationPickup
) {
  let shipments = [];
  let numberOfEmployes = 0;

  for (let i = 1; numberOfEmployes < employesLength; i++) {
    const location = randomGeo(
      {
        latitude: Number(companyLocation.latitude),
        longitude: Number(companyLocation.longitude)
      },
      Number(radius)
    );
    const numberOfPickup = randomIntFromInterval(1, 3);
    if (numberOfEmployes + numberOfPickup <= employesLength) {
      shipments.push({
        numberOfEmploye: `${numberOfPickup}`,
        ramassage: {
          latitude: `${location.latitude}`,
          longitude: `${location.longitude}`
        },
        remisage: {
          latitude: `${location.latitude}`,
          longitude: `${location.longitude}`
        },
        id: `${i}`
      });
      numberOfEmployes += numberOfPickup;
    }
  }
  return shipments;
}
