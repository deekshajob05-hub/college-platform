"use client";
import { useState, useEffect } from "react";

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placements: string;
  courses: string;
  overview: string;
}

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  // State tracking for side-by-side comparison matrix
  const [selectedToCompare, setSelectedToCompare] = useState<College[]>([]);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges?search=${search}&location=${location}`);
        const data = await res.json();
        setColleges(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchColleges();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, location]);

  const toggleCompare = (college: College) => {
    if (selectedToCompare.find(c => c.id === college.id)) {
      setSelectedToCompare(selectedToCompare.filter(c => c.id !== college.id));
    } else {
      if (selectedToCompare.length >= 3) {
        alert("You can compare a maximum of 3 colleges side-by-side!");
        return;
      }
      setSelectedToCompare([...selectedToCompare, college]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 text-gray-900 pb-44">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🎓 College Discovery Platform</h1>
        <p className="text-gray-600 mb-8">Find and compare your dream engineering and management colleges.</p>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search by college name (e.g., IIT)..."
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="📍 Filter by location (e.g., Mumbai)..."
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Results Grid Row */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading colleges...</div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">No colleges matched your search parameters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const isSelected = !!selectedToCompare.find(c => c.id === college.id);
              return (
                <div key={college.id} className={`bg-white rounded-xl shadow-md border flex flex-col justify-between p-6 transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{college.name}</h2>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        ★ {college.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">📍 {college.location}</p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Placements:</span> {college.placements}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-semibold">Courses:</span> {college.courses}
                    </p>
                  </div>

                  <div className="border-t pt-4 mt-auto flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Annual Fees</p>
                      <p className="text-lg font-bold text-blue-600">
                        {college.fees ? `₹${college.fees.toLocaleString('en-IN')}` : "N/A"}
                      </p>
                    </div>
                    <button 
                      onClick={() => toggleCompare(college)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isSelected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      {isSelected ? "❌ Remove" : "⚖️ Compare"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PERSISTENT COMPARISON COMPONENT DRAWER */}
        {selectedToCompare.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-6 z-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">⚖️ Side-by-Side Comparison Grid</h3>
                <button onClick={() => setSelectedToCompare([])} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Matrix</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedToCompare.map(college => (
                  <div key={college.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                    <h4 className="font-bold text-gray-900 border-b pb-1 mb-2 text-base">{college.name}</h4>
                    <p className="mb-1 text-gray-700">📍 <span className="font-semibold">Location:</span> {college.location}</p>
                    <p className="mb-1 text-gray-700">💰 <span className="font-semibold">Fees:</span> ₹{college.fees.toLocaleString('en-IN')}/year</p>
                    <p className="mb-1 text-gray-700">⭐ <span className="font-semibold">Rating:</span> {college.rating} / 5</p>
                    <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border border-gray-100 line-clamp-2"><span className="font-semibold text-gray-700">Placements:</span> {college.placements}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}