import { useState } from 'react';
import './App.css'; // Ensure global font like 'Inter' or 'Sans' is set here

function App() {
  const [drug, setDrug] = useState('N-[1-(3-methoxyphenyl)ethyl]-4-methyl-2-pyridin-4-yl-1,3-thiazole-5-carboxamide');
  const [target, setTarget] = useState('Receptor-type tyrosine-protein kinase FLT3 (EC 2.7.10.1) (FL cytokine receptor) (Fetal liver kinase-2) (FLK-2) (Fms-like tyrosine kinase 3) (FLT-3) (Stem cell tyrosine kinase 1) (STK-1) (CD antigen CD135)');
  const [predictedAffinity, setPredictedAffinity] = useState(null);
  const [expectedAffinity, setExpectedAffinity] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drug, target }),
      });
      const data = await res.json();

      // If the response has an error key, set the error state
      if (data.error) {
        setError(data.error);
        setPredictedAffinity(null);
        setExpectedAffinity(null);
      } else {
        setPredictedAffinity(data.predicted);
        setExpectedAffinity(data.actual);
      }
    } catch (err) {
      console.error('Prediction failed', err);
      setError('Prediction failed. Please try again later.');
      setPredictedAffinity(null);
      setExpectedAffinity(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
        <h1 className="text-xl font-semibold text-center text-black tracking-tight">
          Drug Target Affinity Predictor
        </h1>
        <p className="text-sm text-neutral-500 mb-4 text-center">
          Predict affinity in just one click!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="drug" className="text-sm font-medium text-neutral-700 mb-1">
              Drug Name / SMILES
            </label>
            <input
              id="drug"
              type="text"
              value={drug}
              onChange={(e) => setDrug(e.target.value)}
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter drug name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="protein" className="text-sm font-medium text-neutral-700 mb-1">
              Protein Name / Sequence
            </label>
            <input
              id="target"
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter protein sequence"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-neutral-800 transition-colors focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              'Predict Affinity'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {predictedAffinity !== null && !error && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-md border border-neutral-200 text-sm text-neutral-700">
            <p>
              <span className="font-semibold">Predicted Affinity:</span> {predictedAffinity}
            </p>
            {expectedAffinity && (
              <p className="mt-1">
                <span className="font-semibold">Expected Affinity:</span> {expectedAffinity}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
