// src/components/DestinationCard.tsx
import React from 'react';
import { MapPin, Camera, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '../types';

export function DestinationCard({
  city,
  country,
  imageUrl,
  description,
  wikiUrl,
  loading,
}: SearchResult) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-xl shadow-lg p-6">
        <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    navigate(`/destination/${encodeURIComponent(city.toLowerCase())}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] cursor-pointer"
    >
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/default-city.jpg';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h3 className="text-2xl font-bold text-white">{city}</h3>
          <p className="text-white/90 flex items-center gap-2">
            <MapPin size={16} />
            {country}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-4 whitespace-pre-line">{description}</p>

        <div className="grid grid-cols-2 gap-4">
          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex items-center justify-center gap-2"
              onClick={(e) => e.stopPropagation()} // Kart tıklamasını engellemek için
            >
              <Info size={18} />
              Wikipedia
            </a>
          )}
          <button
            className="btn btn-outline flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation(); // Kart tıklamasını engellemek için
              // Galeri fonksiyonunu buraya ekleyebilirsiniz
            }}
          >
            <Camera size={18} />
            Galeri
          </button>
        </div>
      </div>
    </div>
  );
}
