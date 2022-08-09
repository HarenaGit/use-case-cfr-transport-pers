import { randomGeo, randomIntFromInterval } from "./dependeciesFunction";

export default function generateVehicules(
  numberOfVehicules,
  companyLocation,
  radius
) {
  let vehicules = [];

  for (let i = 1; i <= numberOfVehicules; i++) {
    const startlocation = randomGeo(
      {
        latitude: Number(companyLocation.latitude),
        longitude: Number(companyLocation.longitude)
      },
      Number(radius)
    );
    const endlocation = randomGeo(
      {
        latitude: Number(companyLocation.latitude),
        longitude: Number(companyLocation.longitude)
      },
      Number(radius)
    );
    let numberOfPlaces = 32;
    let vehiculeType = "sprinter";
    switch (randomIntFromInterval(1, 3)) {
      case 1:
        numberOfPlaces = 32;
        vehiculeType = "sprinter";
        break;
      case 2:
        numberOfPlaces = 15;
        vehiculeType = "mazda";
        break;
      case 3:
        numberOfPlaces = 9;
        vehiculeType = "starex";
        break;
      default:
        vehiculeType = "sprinter";
        numberOfPlaces = 32;
    }
    vehicules.push({
      startLocation: {
        latitude: `${startlocation.latitude}`,
        longitude: `${startlocation.longitude}`
      },
      endLocation: {
        latitude: `${endlocation.latitude}`,
        longitude: `${endlocation.longitude}`
      },
      numberOfPlace: `${numberOfPlaces}`,
      registre: `${vehiculeType}-${i}`,
      finishWork: "21:00",
      startWork: "04:00"
    });
  }
  return vehicules;
}
