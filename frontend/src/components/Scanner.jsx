import { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Camera, CameraOff, CheckCircle, AlertCircle } from "lucide-react";

function Scanner({ onScan }) {
  const [data, setData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = (err, result) => {
    if (err) {
      setError("Camera access denied or unavailable.");
      return;
    }

    if (result) {
      setData(result.text);
      setScanning(false); // Auto stop after success
      if (onScan) {
        onScan(result.text);
      }
    }
  };

  useEffect(() => {
    setError("");
  }, [scanning]);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-800">

      {/* Header */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Camera size={20} />
        Scan Medicine Barcode / QR
      </h2>

      {/* Scanner Area */}
      {scanning ? (
        <div className="rounded-xl overflow-hidden border border-gray-700">
          <BarcodeScannerComponent
            width="100%"
            height={300}
            onUpdate={handleUpdate}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-gray-400">Camera is off</p>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        {!scanning ? (
          <button
            onClick={() => setScanning(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            <Camera size={18} />
            Start Scan
          </button>
        ) : (
          <button
            onClick={() => setScanning(false)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            <CameraOff size={18} />
            Stop
          </button>
        )}
      </div>

      {/* Result */}
      {data && (
        <div className="mt-5 bg-green-700/20 border border-green-600 p-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={18} className="text-green-400" />
          <div>
            <p className="text-sm text-green-300 font-semibold">
              Scan Successful
            </p>
            <p className="text-sm break-all">{data}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-700/20 border border-red-600 p-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Scanner;
