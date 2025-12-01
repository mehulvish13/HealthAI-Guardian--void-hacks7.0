import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const NearbyMap: React.FC = () => {
  const hospitals = [
    { name: 'City General Hospital', dist: '1.2 km', time: '5 min' },
    { name: 'Sunrise Medical Clinic', dist: '2.5 km', time: '12 min' },
    { name: 'Emergency Care Unit', dist: '3.8 km', time: '18 min' },
    { name: 'Community Health Center', dist: '4.1 km', time: '20 min' }
  ];

  return (
    <div className="mx-4 mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-fade-in-up">
       <div className="flex items-center gap-2 mb-3 text-slate-700 border-b border-slate-100 pb-2">
         <MapPin className="w-5 h-5 text-red-500" />
         <h3 className="font-semibold text-sm">Nearby Medical Centers</h3>
       </div>
       <div className="grid gap-3 sm:grid-cols-2">
         {hospitals.map((place, idx) => (
           <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition cursor-pointer group border border-slate-100 hover:border-blue-100">
              <div>
                <div className="font-medium text-slate-800 text-sm group-hover:text-blue-700">{place.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{place.dist} • Open 24/7</div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                <Navigation className="w-3 h-3" />
                {place.time}
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};
