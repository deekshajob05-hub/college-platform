'use client';
import { useState, useEffect } from 'react';

export default function CollegePlatform() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // default sort
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/colleges')
      .then((res) => res.json())
      .then((data) => { setColleges(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // 🛠️ Dynamic Processing Engine (Filters & Sorts on the fly)
  const filteredAndSorted = colleges
    .filter((col) => {
      const matchesSearch = col.name.toLowerCase().includes(search.toLowerCase()) || col.location.toLowerCase().includes(search.toLowerCase());
      const matchesStream = streamFilter === 'All' || col.stream === streamFilter;
      return matchesSearch && matchesStream;
    })
    .sort((a, b) => {
      if (sortBy === 'fees') return a.fees - b.fees; // Lowest fee first
      if (sortBy === 'cutoff') return b.cutoff - a.cutoff; // Highest cutoff first
      return b.rating - a.rating; // Highest rating first
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">🎓 Indian College Finder</h1>
        <p className="text-gray-600">Discover your ideal campus, tracking cutoffs, fees, and ratings live.</p>
      </header>

      {/* ⚡ Features Dashboard Control Bar */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search Campuses</label>
          <input 
            type="text" placeholder="Type name or city..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Filter by Stream</label>
          <select value={streamFilter} onChange={(e) => setStreamFilter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="All">All Streams</option>
            <option value="Engineering">Engineering</option>
            <option value="Management">Management</option>
            <option value="Medical">Medical</option>
            <option value="Arts & Science">Arts & Science</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sort Results By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <option value="rating">Highest Star Rating ⭐</option>
            <option value="fees">Affordability (Low Fees) 💸</option>
            <option value="cutoff">Highest Cutoff % 📊</option>
          </select>
        </div>
      </div>

      {/* 📊 Display Grid */}
      {loading ? (
        <div className="text-center text-xl text-gray-600">Syncing structural nodes...</div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((college) => (
            <div key={college.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{college.logo || "🏛️"}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-xs">{college.stream}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{college.name}</h3>
                <p className="text-gray-500 text-sm mb-4">📍 {college.location}, {college.state}</p>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Cutoff</p>
                  <p className="text-sm font-bold text-gray-700">{college.cutoff}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Annual Fee</p>
                  <p className="text-sm font-bold text-blue-600">₹{college.fees.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Rating</p>
                  <p className="text-sm font-bold text-yellow-500">⭐ {college.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
