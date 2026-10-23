import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking...");
  const [database, setDatabase] = useState("Checking...");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health")
      .then((response) => {
        setStatus(response.data.message);
        setDatabase(response.data.database);
      })
      .catch(() => {
        setStatus("Backend unavailable");
        setDatabase("Disconnected");
      });
  }, []);

  return (
    <main className="container py-5">
      <h1>InfoLens</h1>
      <p>MERN project setup verification</p>

      <div className="card p-4 mt-4">
        <h2 className="h5">Backend status</h2>
        <p>{status}</p>

        <h2 className="h5">Database status</h2>
        <p>{database}</p>
      </div>
    </main>
  );
}

export default App;