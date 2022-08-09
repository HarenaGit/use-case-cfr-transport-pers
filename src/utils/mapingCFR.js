import { convertDateToRFC3339UTCZulu } from "./convertDateToRFC3339UTCZulu";
import { computeCostPerKilometer } from "./dependeciesFunction";

export default function mapingCFR(
  companyInfo,
  considerTrafic,
  planningDateYYYY_MM_DD,
  shipments,
  vehicles,
  startWork,
  finishWork,
  fuelPrice,
  pickupDuration,
  traficPoints,
  disableTraficPoints,
  lateDateTolerated = null
) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  let CFR = {
    model: {},
    searchMode: 1,
    interpretInjectedSolutionsUsingLabels: false,
    considerRoadTraffic: considerTrafic,
    populateTransitionPolylines: false,
    allowLargeDeadlineDespiteInterruptionRisk: false,
    label: `${companyInfo.adresse} - ${currentTimestamp}`
  };

  let model = {
    shipments: [],
    vehicles: [],
    globalStartTime: convertDateToRFC3339UTCZulu(
      `${planningDateYYYY_MM_DD} 00:00:00`
    ),
    globalEndTime: convertDateToRFC3339UTCZulu(
      `${planningDateYYYY_MM_DD} 23:59:59`
    )
  };
  for (let i = 0; i < shipments.length; i++) {
    model.shipments.push({
      pickups: [
        {
          arrivalWaypoint: {
            location: {
              latLng: {
                latitude: Number(`${shipments[i].ramassage.latitude}`),
                longitude: Number(`${shipments[i].ramassage.longitude}`)
              }
            }
          },
          duration: `${pickupDuration * shipments[i].numberOfEmploye}s`,
          label: `${shipments[i].id}-ramassage`
        }
      ],
      deliveries: [
        {
          arrivalWaypoint: {
            location: {
              latLng: {
                latitude: Number(`${companyInfo.latitude}`),
                longitude: Number(`${companyInfo.longitude}`)
              }
            }
          },
          timeWindows: [
            {
              startTime: convertDateToRFC3339UTCZulu(
                `${planningDateYYYY_MM_DD} ${startWork}`
              ),
              endTime: convertDateToRFC3339UTCZulu(
                `${planningDateYYYY_MM_DD} ${startWork}`,
                lateDateTolerated
              )
            }
          ],
          duration: `${pickupDuration * shipments[i].numberOfEmploye}s`,
          label: `${shipments[i].id}-depot-matin`
        }
      ],
      loadDemands: {
        place: {
          amount: `${shipments[i].numberOfEmploye}`
        }
      }
    });
    model.shipments.push({
      deliveries: [
        {
          arrivalWaypoint: {
            location: {
              latLng: {
                latitude: Number(`${shipments[i].remisage.latitude}`),
                longitude: Number(`${shipments[i].remisage.longitude}`)
              }
            }
          },
          duration: `${pickupDuration * shipments[i].numberOfEmploye}s`,
          label: `${shipments[i].id}-remisage`
        }
      ],
      pickups: [
        {
          arrivalWaypoint: {
            location: {
              latLng: {
                latitude: Number(`${companyInfo.latitude}`),
                longitude: Number(`${companyInfo.longitude}`)
              }
            }
          },
          timeWindows: [
            {
              startTime: convertDateToRFC3339UTCZulu(
                `${planningDateYYYY_MM_DD} ${finishWork}`
              ),
              endTime: convertDateToRFC3339UTCZulu(
                `${planningDateYYYY_MM_DD} ${finishWork}`,
                lateDateTolerated
              )
            }
          ],
          duration: `${pickupDuration * shipments[i].numberOfEmploye}s`,
          label: `${shipments[i].id}-pickup-soir`
        }
      ],
      loadDemands: {
        place: {
          amount: `${shipments[i].numberOfEmploye}`
        }
      }
    });
  }
  for (let i = 0; i < vehicles.length; i++) {
    let loadLimits = {
      place: {
        maxLoad: `${vehicles[i].numberOfPlace}`,
        startLoadInterval: {},
        endLoadInterval: {}
      }
    };
    for (let j = 0; j < traficPoints.length; j++) {
      loadLimits[`traffic_${traficPoints[j].adresse.split(" ")[0]}`] = {
        maxLoad: "1",
        startLoadInterval: {},
        endLoadInterval: {}
      };
    }
    model.vehicles.push({
      startWaypoint: {
        location: {
          latLng: {
            latitude: Number(`${vehicles[i].startLocation.latitude}`),
            longitude: Number(`${vehicles[i].startLocation.longitude}`)
          }
        }
      },
      endWaypoint: {
        location: {
          latLng: {
            latitude: Number(`${vehicles[i].endLocation.latitude}`),
            longitude: Number(`${vehicles[i].endLocation.longitude}`)
          }
        }
      },
      endTimeWindows: [
        {
          startTime: convertDateToRFC3339UTCZulu(
            `${planningDateYYYY_MM_DD} ${vehicles[i].finishWork}`
          ),
          endTime: convertDateToRFC3339UTCZulu(
            `${planningDateYYYY_MM_DD} ${vehicles[i].finishWork}`
          )
        }
      ],
      ...(!considerTrafic && { costPerHour: 1 }),
      costPerKilometer: computeCostPerKilometer(parseInt(fuelPrice)),
      travelDurationLimit: {},
      label: `${vehicles[i].registre}`,
      loadLimits: loadLimits
    });
  }
  for (let i = 0; i < traficPoints.length; i++) {
    for (let j = 0; j < vehicles.length; j++) {
      model.shipments.push({
        pickups: [
          {
            arrivalWaypoint: {
              location: {
                latLng: {
                  latitude: Number(`${traficPoints[i].latitude}`),
                  longitude: Number(`${traficPoints[i].longitude}`)
                }
              }
            },
            duration: `${
              60 * disableTraficPoints ? 0 : Number(traficPoints[i].duration)
            }s`
          }
        ],
        deliveries: [
          {
            arrivalWaypoint: {
              location: {
                latLng: {
                  latitude: Number(`${companyInfo.latitude}`),
                  longitude: Number(`${companyInfo.longitude}`)
                }
              }
            },
            timeWindows: [
              {
                startTime: convertDateToRFC3339UTCZulu(
                  `${planningDateYYYY_MM_DD} ${startWork}`
                ),
                endTime: convertDateToRFC3339UTCZulu(
                  `${planningDateYYYY_MM_DD} ${startWork}`,
                  lateDateTolerated
                )
              }
            ]
          }
        ],
        label: `${i + 1}-${vehicles[j].registre}-${
          traficPoints[i].adresse
        }-fictif-shipments`,
        loadDemands: {
          ["traffic_" + traficPoints[i].adresse.split(" ")[0]]: {
            amount: "1"
          }
        },
        penaltyCost: 1
      });
    }
  }
  CFR.model = model;
  return CFR;
}
