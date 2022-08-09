import React, { useState, useEffect } from "react";
import Header from "../component/Header";
import Footer from "../component/footer";
import sampleData from "../samples/transport-etech.json";
import sampleData2 from "../samples/transport-etech-avec-trafic.json";
import sampleData3 from "../samples/transport-etech-sans-trafic.json";
import createShipments from "../utils/generateShipments";
import createVehicles from "../utils/generateVehicles";
import mapingCFR from "../utils/mapingCFR";
import downloadJson from "../utils/exportJsonToFile";
import { dateToYMD } from "../utils/dependeciesFunction";

const VehiclesInputs = ({ item, onDelete, onChange }) => {
  const {
    startLocation,
    endLocation,
    registre,
    finishWork,
    numberOfPlace
  } = item;
  return (
    <div
      style={{
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 50,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#ccc"
      }}
    >
      <input
        style={{ marginBottom: 15 }}
        type="text"
        placeholder="immatriculation"
        name="registre"
        value={registre}
        onChange={onChange}
      />
      <input
        style={{ marginBottom: 15 }}
        type="number"
        placeholder="Nombre de places"
        value={numberOfPlace}
        name="numberOfPlace"
        onChange={onChange}
      />
      <p>Heure de fin de travail du conducteur : </p>
      <input
        value={finishWork}
        style={{ marginBottom: 15 }}
        type="time"
        placeholder=""
        name="finishWork"
        onChange={onChange}
      />
      <div style={{ display: "flex", marginBottom: 5 }}>
        <p>Emplacement de depart : </p>
        <input
          type="text"
          style={{ marginLeft: 15 }}
          placeholder="latitude..."
          value={startLocation.latitude}
          name="startLocation.latitude"
          onChange={onChange}
        />
        <input
          type="text"
          style={{ marginLeft: 15 }}
          placeholder="longitude..."
          value={startLocation.longitude}
          name="startLocation.longitude"
          onChange={onChange}
        />
      </div>
      <div style={{ display: "flex" }}>
        <p>Emplacement de d'arrive : </p>
        <input
          style={{ marginLeft: 15 }}
          type="text"
          placeholder="latitude..."
          name="endLocation.latitude"
          onChange={onChange}
          value={endLocation.latitude}
        />
        <input
          style={{ marginLeft: 15 }}
          type="text"
          placeholder="longitude..."
          name="endLocation.longitude"
          onChange={onChange}
          value={endLocation.longitude}
        />
      </div>
      <button onClick={onDelete} className="text-color-red">
        supprimer
      </button>
    </div>
  );
};

const ShipmentsInputs = ({ item, onDelete, onChange }) => {
  const { numberOfEmploye, ramassage, remisage, id } = item;
  return (
    <div
      style={{
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 50,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#ccc"
      }}
    >
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Id : </p>
        <input
          type="text"
          name="shipmentId"
          onChange={onChange}
          value={id}
          placeholder="shipmentId"
        />
      </div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Ramassage : </p>
        <input
          style={{ marginLeft: 30 }}
          value={ramassage.latitude}
          type="text"
          name="ramassage.latitude"
          onChange={onChange}
          placeholder="Latitude"
        />
        <input
          style={{ marginLeft: 30 }}
          value={ramassage.longitude}
          type="text"
          onChange={onChange}
          name="ramassage.longitude"
          placeholder="Longitude"
        />
      </div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Remisage : </p>
        <input
          style={{ marginLeft: 30 }}
          value={remisage.latitude}
          type="text"
          onChange={onChange}
          name="remisage.latitude"
          placeholder="Latitude"
        />
        <input
          style={{ marginLeft: 30 }}
          value={remisage.longitude}
          type="text"
          name="remisage.longitude"
          placeholder="Longitude"
          onChange={onChange}
        />
      </div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Nombre d'employes : </p>
        <input
          type="text"
          value={numberOfEmploye}
          name="numberOfEmploye"
          onChange={onChange}
          placeholder="Nombre d'employe a prendre/livrer"
        />
      </div>
      <div style={{ dipslay: "flex" }}>
        <button onClick={onDelete} className="text-color-red">
          supprimer
        </button>
      </div>
    </div>
  );
};

const TraficPoint = ({ item, disable, onDelete, onChange }) => {
  const { adresse, latitude, longitude, timeWindows, duration } = item;
  return (
    <div
      style={{
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 50,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#ccc",
        opacity: disable ? 0.3 : 1
      }}
    >
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>*adresse (champs requis) : </p>
        <input
          type="text"
          value={adresse}
          name="adresse"
          placeholder="emplacement...."
          onChange={onChange}
        />
      </div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Coordonnees : </p>
        <input
          style={{ marginLeft: 30 }}
          type="text"
          name="latitude"
          value={latitude}
          placeholder="Latitude..."
          onChange={onChange}
        />
        <input
          style={{ marginLeft: 30 }}
          type="text"
          name="longitude"
          value={longitude}
          placeholder="Longitude..."
          onChange={onChange}
        />
      </div>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <p>Durree en minute pour sortir du trafic : </p>
        <input
          type="text"
          value={duration}
          name="duration"
          placeholder="durree"
          onChange={onChange}
        />
      </div>
      <div style={{ dipslay: "flex" }}>
        <button onClick={onDelete} className="text-color-red">
          supprimer
        </button>
      </div>
    </div>
  );
};

const Main = () => {
  const [data, setData] = useState({});
  const [companyInfo, setCompanyInfo] = useState({});
  const [radiusGeoPoint, setRadiusGeoPoint] = useState("5000");
  const [planningDate, setPlanningDate] = useState(new Date());
  const [startEmployeWork, setStartEmployeWork] = useState("");
  const [endEmployeWork, setEndEmployeWork] = useState("");
  const [considerTimeByTrafic, setConsiderTimeByTrafic] = useState(true);
  const [fuelPrice, setFuelPrice] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [vehiclesNumber, setvehiclesNumber] = useState("0");
  const [shipmentsNumber, setShipmentsNumber] = useState("0");
  const [numberOfEmployes, setNumberOfEmployes] = useState("0");
  const [durationPickup, setDurationPickup] = useState("10");
  const [traficPoints, setTraficPoints] = useState([]);
  const [lateDateTolerated, setLateDateTolerated] = useState(0);
  const [disableTraficPoint, setDisableTraficPoint] = useState(false);

  const onChangeSample = (e) => {
    const { value } = e.target;
    switch (value) {
      case "transport-etech-test":
        setData(sampleData);
        break;
      case "transport-etech-test-avec-trafic":
        setData(sampleData2);
        break;
      case "transport-etech-test-sans-trafic":
        setData(sampleData3);
        break;
      default:
        setData({});
        return;
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "company_adresse":
        setCompanyInfo({
          ...companyInfo,
          adresse: value
        });
        break;
      case "company_latitude":
        setCompanyInfo({
          ...companyInfo,
          latitude: value
        });
        break;
      case "company_longitude":
        setCompanyInfo({
          ...companyInfo,
          longitude: value
        });
        break;
      case "radius":
        setRadiusGeoPoint(value);
        break;
      case "planningDate":
        setPlanningDate(new Date(value));
        break;
      case "startWork":
        setStartEmployeWork(value);
        break;
      case "finishWork":
        setEndEmployeWork(value);
        break;
      case "fuelPrice":
        setFuelPrice(value);
        break;
      case "vehiculeNumber":
        setvehiclesNumber(value);
        setVehicles([]);
        break;
      case "shipmentsNumber":
        //setShipmentsNumber(value);
        //setShipments([]);
        break;
      case "numberOfEmployes":
        setNumberOfEmployes(value);
        break;
      case "durationPickup":
        setDurationPickup(value);
        break;
      case "lateDateTolerated":
        setLateDateTolerated(value);
        break;
      default:
        return;
    }
  };

  const onChangeTraficPointInput = (e, idx) => {
    const { name, value } = e.target;
    setTraficPoints(
      traficPoints.map((item, index) => {
        if (index === idx) {
          switch (name) {
            case "adresse":
              item.adresse = value;
              break;
            case "latitude":
              item.latitude = value;
              break;
            case "longitude":
              item.longitude = value;
              break;
            case "duration":
              item.duration = value;
              break;
            default:
              return item;
          }
        }
        return item;
      })
    );
  };

  const generateShipments = () => {
    if (isNaN(parseInt(numberOfEmployes))) {
      alert("Verifier le nombre d'employe de la companie :) !");
      return;
    }
    if (
      Number(companyInfo.latitude) === 0 ||
      Number(companyInfo.longitude) === 0 ||
      Number(radiusGeoPoint) === 0
    ) {
      alert(
        "Veuiller verifier les informations du champ 'Nom de la compagnie' ou 'Rayon...' pour pouvoir generer des vehicles ou des shipments"
      );
      return;
    }
    const ships = createShipments(
      numberOfEmployes,
      companyInfo,
      radiusGeoPoint,
      durationPickup
    );
    setShipments(ships);
    setShipmentsNumber(ships.length);
  };

  const generatevehicles = () => {
    if (isNaN(parseInt(vehiclesNumber))) {
      alert("Verifier le nombre de vehicles a generer svp :) !");
      return;
    }

    if (
      Number(companyInfo.latitude) === 0 ||
      Number(companyInfo.longitude) === 0 ||
      Number(radiusGeoPoint) === 0
    ) {
      alert(
        "Veuiller verifier les informations du champ 'Nom de la compagnie' ou 'Rayon...' pour pouvoir generer des vehicles ou des shipments"
      );
      return;
    }
    const v = createVehicles(vehiclesNumber, companyInfo, radiusGeoPoint);
    setVehicles(v);
    setvehiclesNumber(v.length);
  };

  const addVehicles = () => {
    setVehicles([
      {
        startLocation: {
          latitude: "",
          longitude: "",
          adresse: ""
        },
        endLocation: {
          latitude: "",
          longitude: "",
          adresse: ""
        },
        numberOfPlace: "",
        registre: "",
        finishWork: "",
        startWork: ""
      },
      ...vehicles
    ]);
    setvehiclesNumber(vehicles.length);
  };

  const addShipments = () => {
    setShipments([
      {
        numberOfEmploye: "",
        ramassage: {
          latitude: "",
          longitude: ""
        },
        remisage: {
          latitude: "",
          longitude: ""
        },
        id: `${shipments.length}`
      },
      ...shipments
    ]);
    setShipmentsNumber(shipments.length);
  };

  const addtraficPoints = () => {
    setTraficPoints([
      {
        adresse: `rue_${traficPoints.length + 1}`,
        latitude: "",
        longitude: "",
        duration: ""
      },
      ...traficPoints
    ]);
  };

  const onDeleteVehicles = (idx) => {
    setVehicles(vehicles.filter((val, index) => index !== idx));
    setvehiclesNumber(vehicles.length - 1);
  };

  const onDeleteShipments = (idx) => {
    setShipments(shipments.filter((val, index) => index !== idx));
    setShipmentsNumber(shipments.length - 1);
  };

  const onDeleteTraficPoints = (idx) => {
    setTraficPoints(traficPoints.filter((val, index) => idx !== index));
  };

  const clearTraficPoints = () => {
    setTraficPoints([]);
  };

  const clearVehicles = () => {
    setVehicles([]);
    setvehiclesNumber(0);
  };

  const clearShipments = () => {
    setShipments([]);
    setShipmentsNumber(0);
  };

  const onVehiclesInputsChange = (e, idx) => {
    const { name, value } = e.target;
    setVehicles(
      vehicles.map((item, index) => {
        if (index === idx) {
          switch (name) {
            case "registre":
              item.registre = value;
              break;
            case "numberOfPlace":
              item.numberOfPlace = value;
              break;
            case "finishWork":
              item.finishWork = value;
              break;
            case "startLocation.latitude":
              item.startLocation.latitude = value;
              break;
            case "startLocation.longitude":
              item.startLocation.longitude = value;
              break;
            case "endLocation.latitude":
              item.endLocation.latitude = value;
              break;
            case "endLocation.longitude":
              item.endLocation.longitude = value;
              break;
            default:
              return item;
          }
        }
        return item;
      })
    );
  };

  const onShipmentsInputsChange = (e, idx) => {
    const { name, value } = e.target;
    setShipments(
      shipments.map((item, index) => {
        if (idx === index) {
          switch (name) {
            case "shipmentId":
              item.id = value;
              break;
            case "numberOfEmploye":
              item.numberOfEmploye = value;
              break;
            case "ramassage.latitude":
              item.ramassage.latitude = value;
              break;
            case "ramassage.longitude":
              item.ramassage.longitude = value;
              break;
            default:
              return item;
          }
        }
        return item;
      })
    );
  };

  useEffect(() => {
    setCompanyInfo({
      adresse: data.company ? data.company.adresse : "",
      latitude: data.company ? data.company.latitude : "",
      longitude: data.company ? data.company.longitude : ""
    });
    setRadiusGeoPoint(data.radiusFromCompany ? data.radiusFromCompany : "5000");
    setStartEmployeWork(data.startEmployeWork ? data.startEmployeWork : "");
    setEndEmployeWork(data.endEmployeWork ? data.endEmployeWork : "");
    setConsiderTimeByTrafic(data.considerMinimalTimeByTraffic ? true : false);
    setFuelPrice(data.fuelPrice ? data.fuelPrice : "");
    setVehicles(data.vehicles ? data.vehicles : []);
    setvehiclesNumber(data.vehicles ? `${data.vehicles.length}` : "0");
    setPlanningDate(
      data.planningDate ? new Date(data.planningDate) : new Date()
    );
    setShipments(data.shipments ? data.shipments : []);
    setShipmentsNumber(data.shipments ? `${data.shipments.length}` : "0");
    setNumberOfEmployes(data.numberOfEmployes ? data.numberOfEmployes : "0");
    setDurationPickup(data.durationPickup ? data.durationPickup : "10");
    setLateDateTolerated(data.lateDateTolerated ? data.lateDateTolerated : 0);
    setTraficPoints(data.traficPoints ? data.traficPoints : []);
    setDisableTraficPoint(
      data.isTrafficPointDisable ? data.isTrafficPointDisable : false
    );
  }, [data]);

  const exportMappingCFR = () => {
    try {
      const cfr = mapingCFR(
        companyInfo,
        considerTimeByTrafic,
        `${dateToYMD(planningDate)}`,
        shipments,
        vehicles,
        startEmployeWork,
        endEmployeWork,
        fuelPrice,
        durationPickup,
        traficPoints,
        disableTraficPoint,
        lateDateTolerated
      );
      downloadJson(cfr);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <Header onExportClick={exportMappingCFR} />
      <div
        style={{
          width: "100%",
          marginTop: 1,
          height: "calc(100vh - 104px)",
          display: "flex"
        }}
      >
        <div
          style={{
            flex: 2,
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto"
          }}
        >
          <div style={{ display: "block", padding: 20 }}>
            <div>
              <p>Exemple de cas : </p>
              <select
                className="select-input"
                onChange={onChangeSample}
                placeholder="Exemple"
              >
                <option value="">choisir...</option>
                <option value="transport-etech-test">
                  Template transport etech cas simple
                </option>
                <option value="transport-etech-test-avec-trafic">
                  Template transport etech avec points de trafic
                </option>
                <option value="transport-etech-test-sans-trafic">
                  Template transport etech sans points de trafic
                </option>
              </select>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Nom de la compagnie : </p>
              </div>
              <div style={{ display: "block" }}>
                <input
                  style={{ marginTop: 15 }}
                  type="text"
                  placeholder="nom de la compagnie ..."
                  name="company_adresse"
                  onChange={onInputChange}
                  value={companyInfo.adresse ? companyInfo.adresse : ""}
                />
                <input
                  style={{ marginTop: 15 }}
                  type="text"
                  placeholder="Latitude ..."
                  name="company_latitude"
                  onChange={onInputChange}
                  value={companyInfo.latitude ? companyInfo.latitude : ""}
                />
                <input
                  style={{ marginTop: 15 }}
                  type="text"
                  placeholder="Longitude ..."
                  name="company_longitude"
                  onChange={onInputChange}
                  value={companyInfo.longitude ? companyInfo.longitude : ""}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>
                  Rayon à vol d'oiseau pour generer les GeoPoint (en metre) :{" "}
                </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="text"
                  onChange={onInputChange}
                  name="radius"
                  placeholder="rayon en metre..."
                  value={radiusGeoPoint}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Date de plannification : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  value={dateToYMD(planningDate)}
                  onChange={onInputChange}
                  name="planningDate"
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="date"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>*Entrer du personnel à : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="time"
                  onChange={onInputChange}
                  name="startWork"
                  placeholder="hh:mm:ss"
                  value={startEmployeWork}
                />
              </div>
              <div style={{ marginLeft: 35 }}>
                <p>- *Sortie à : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15 }}
                  type="time"
                  onChange={onInputChange}
                  name="finishWork"
                  placeholder="hh:mm:ss"
                  value={endEmployeWork}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Retard en minute tolerer : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="number"
                  onChange={onInputChange}
                  name="lateDateTolerated"
                  placeholder="minutes..."
                  value={lateDateTolerated}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Considerer le temps optimal de trajet par : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20, cursor: "pointer" }}
                  type="checkbox"
                  title="traffic"
                  onChange={() =>
                    setConsiderTimeByTrafic(!considerTimeByTrafic)
                  }
                  checked={considerTimeByTrafic}
                />
                <span>Traffic </span>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20, cursor: "pointer" }}
                  type="checkbox"
                  title="cout par heure"
                  onChange={() =>
                    setConsiderTimeByTrafic(!considerTimeByTrafic)
                  }
                  checked={!considerTimeByTrafic}
                />
                <span>cout par heure</span>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Prix unitaire de carburant : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="text"
                  placeholder="prix du carburant"
                  name="fuelPrice"
                  onChange={onInputChange}
                  value={fuelPrice}
                />
                <span> / litre</span>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Nombres d'employes : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="number"
                  placeholder="nombre des employes de la compagnie"
                  name="numberOfEmployes"
                  onChange={onInputChange}
                  value={numberOfEmployes}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div>
                <p>Duree pour prendre/depose un employe en second : </p>
              </div>
              <div style={{ dipsplay: "block" }}>
                <input
                  style={{ marginTop: 15, marginLeft: 20 }}
                  type="number"
                  placeholder="durre en second"
                  name="durationPickup"
                  onChange={onInputChange}
                  value={durationPickup}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            flex: 2,
            overflow: "auto",
            borderLeftStyle: "solid",
            borderLeftWidth: 2,
            borderLeftColor: "#ccc"
          }}
        >
          <div style={{ display: "block", padding: 20 }}>
            <p>
              Liste des vehicles de transport :{" "}
              <input
                type="number"
                style={{ marginBottom: 10 }}
                placeholder="nombre"
                name="vehiculeNumber"
                onChange={onInputChange}
                value={vehiclesNumber}
              />{" "}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    generatevehicles();
                  }}
                  className="text-color-green"
                >
                  Generer
                </button>{" "}
                <button onClick={addVehicles}>Ajouter</button>{" "}
                <button
                  onClick={() => clearVehicles()}
                  className="text-color-red"
                >
                  Effacer
                </button>
              </div>
            </p>
            {vehicles.map((value, idx) => {
              return (
                <VehiclesInputs
                  item={value}
                  onDelete={() => onDeleteVehicles(idx)}
                  onChange={(e) => {
                    onVehiclesInputsChange(e, idx);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div
          style={{
            flex: 2,
            overflow: "auto",
            borderLeftStyle: "solid",
            borderLeftWidth: 2,
            borderLeftColor: "#ccc"
          }}
        >
          <div style={{ display: "block", padding: 20 }}>
            <p>
              Liste des shipments : (Depent du nombre d'employes :{" "}
              <strong>{numberOfEmployes}</strong>)
              <input
                style={{ marginBottom: 10 }}
                type="number"
                placeholder="nombre"
                name="shipmentsNumber"
                onChange={onInputChange}
                value={shipmentsNumber}
              />{" "}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    generateShipments();
                  }}
                  className="text-color-green"
                >
                  Generer
                </button>{" "}
                <button onClick={addShipments}>Ajouter</button>{" "}
                <button
                  onClick={() => clearShipments()}
                  className="text-color-red"
                >
                  Effacer
                </button>
              </div>
            </p>
            {shipments.map((value, index) => {
              return (
                <ShipmentsInputs
                  onDelete={() => onDeleteShipments(index)}
                  item={value}
                  onChange={(e) => {
                    onShipmentsInputsChange(e, index);
                  }}
                />
              );
            })}
          </div>
        </div>
        <div
          style={{
            flex: 2,
            overflow: "auto",
            borderLeftStyle: "solid",
            borderLeftWidth: 2,
            borderLeftColor: "#ccc"
          }}
        >
          <div style={{ display: "block", padding: 20 }}>
            <p>
              Point à trafic dense le matin ({traficPoints.length}) :{" "}
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "space-between"
                }}
              >
                <button onClick={addtraficPoints}>Ajouter</button>{" "}
                <button onClick={clearTraficPoints} className="text-color-red">
                  Effacer
                </button>
              </div>
            </p>
            <div style={{ dipsplay: "flex", marginBottom: 20 }}>
              <input
                style={{ width: 30, height: 30, cursor: "pointer" }}
                type="checkbox"
                title="traffic point"
                onChange={() => setDisableTraficPoint(!disableTraficPoint)}
                checked={disableTraficPoint}
              />
              <span>Desactiver la prise en compte des points de trafics</span>
            </div>
            {traficPoints.map((item, idx) => (
              <TraficPoint
                item={item}
                onChange={(e) => onChangeTraficPointInput(e, idx)}
                onDelete={() => onDeleteTraficPoints(idx)}
                disable={disableTraficPoint}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
