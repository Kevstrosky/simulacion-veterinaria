"use client";
import React, { useState, useEffect } from "react";

interface PatientRecord {
  id: number;
  name: string;
}

const Simulation: React.FC = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [patients, setPatients] = useState<string[]>([]);
  const [currentPatient, setCurrentPatient] = useState<string | null>(null);
  const [patientCounter, setPatientCounter] = useState<number>(1);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const startSimulation = () => {
    setSimulating(true);
    setStartTime(Date.now());
  };

  const getTimeElapsed = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (simulating) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [simulating]);

  useEffect(() => {
    if (simulating) {
      const interval = setInterval(() => {
        const newPatient = `Animal ${patientCounter}`;
        setPatients((prevPatients) => [...prevPatients, newPatient]);
        setPatientCounter((prevCounter) => prevCounter + 1);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [simulating, patientCounter]);

  useEffect(() => {
    if (simulating && patients.length > 0 && !currentPatient) {
      const nextPatient = patients[0];
      setCurrentPatient(nextPatient);
      setPatients((prevPatients) => prevPatients.slice(1));
      const consultationTime = Math.floor(Math.random() * 10) + 1;
      setTimeout(() => {
        setCurrentPatient(null);
        setPatientRecords((prevRecords) => [
          ...prevRecords,
          { id: prevRecords.length + 1, name: nextPatient },
        ]);
      }, consultationTime * 1000);
    }
  }, [simulating, patients, currentPatient]);

  return (
    <div className="max-w-[960px] mx-auto py-8 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4 text-[#39A7FF]">
          Simulación de Veterinaria (Eventos Discretos)
        </h1>
        <h1 className="text-3xl font-bold mb-4 text-[#0174BE]">
          Por Kevin Ochoa Guerrero
        </h1>
      </div>
      {!simulating && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startSimulation}
        >
          Iniciar Simulación
        </button>
      )}
      {simulating && <p>Tiempo transcurrido: {currentTime} segundos</p>}

      {simulating && (
        <>
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Animales en espera:</h2>
            <ul>
              {patients.map((patient, index) => (
                <li key={index}>{patient}</li>
              ))}
            </ul>
          </div>

          {currentPatient && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Animales en consulta:</h2>
              <p>{currentPatient}</p>
            </div>
          )}

          {patientRecords.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-green-500">
                Animales atendidos:
              </h2>
              <div
                className={
                  patientRecords.length > 5 ? "overflow-y-auto h-80" : ""
                }
              >
                <table className="border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">ID</th>
                      <th className="border border-gray-400 px-4 py-2">
                        Nombre
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="border border-gray-400 px-4 py-2">
                          {record.id}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          {record.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Simulation;
