// App.jsx
import { useEffect, useState } from 'react';

export default function App() {
  const [botStatus, setBotStatus] = useState("Waiting...");
  const [logs, setLogs] = useState([]);
  const [accessCount, setAccessCount] = useState(0);
  const maxFreeAccess = 5;

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem("accessCount") || "0", 10);
    setAccessCount(storedCount);
  }, []);

  useEffect(() => {
    if (accessCount >= maxFreeAccess) return;

    const interval = setInterval(() => {
      fetch("https://otc-bot-api.onrender.com/analyze")
        .then(res => res.json())
        .then(data => {
          setBotStatus(data.status);
          setLogs(prev => [data.log, ...prev].slice(0, 20));

          const newCount = accessCount + 1;
          setAccessCount(newCount);
          localStorage.setItem("accessCount", newCount.toString());
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [accessCount]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">OTC Bot Live Dashboard</h1>

      {accessCount >= maxFreeAccess ? (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <p className="text-lg text-red-600 font-semibold">
            Free usage limit reached (5/5). Please upgrade for unlimited access.
          </p>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-white rounded shadow">
          <p className="text-lg">Status: <span className="font-mono">{botStatus}</span></p>
          <p className="text-sm mt-1 text-gray-600">Free Access Used: {accessCount} / {maxFreeAccess}</p>
        </div>
      )}

      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <div className="max-h-64 overflow-y-auto text-sm font-mono space-y-1">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
