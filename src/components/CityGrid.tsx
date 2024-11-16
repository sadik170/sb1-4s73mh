// src/components/CityGrid.tsx
import React, { useEffect, useState } from 'react';
import { useCities } from '../hooks/useCities';
import { DestinationCard } from './DestinationCard';
import { ErrorMessage } from './ErrorMessage';
import { getCityImage } from '../lib/pixabay';

export function CityGrid() {
  const { data: cities, isLoading, error } = useCities();
  const [cityImages, setCityImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImages = async () => {
      if (cities) {
        const images: Record<string, string> = {};
        for (const city of cities) {
          const imageUrl = await getCityImage(city.name);
          images[city.name] = imageUrl;
        }
        setCityImages(images);
      }
    };

    loadImages();
  }, [cities]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <DestinationCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message="Şehir bilgileri yüklenirken bir hata oluştu." />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cities?.map((city) => (
        <DestinationCard
          key={`${city.name}-${city.country}`}
          city={city.name}
          country={city.country}
          imageUrl={cityImages[city.name] || '/images/default-city.jpg'}
          description={`${
            city.name
          }, ${city.population.toLocaleString()} nüfusuyla ${
            city.country
          }'nin önemli şehirlerinden biridir.`}
        />
      ))}
    </div>
  );
}
