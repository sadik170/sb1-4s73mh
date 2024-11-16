import React from 'react';
import { DestinationCard } from './DestinationCard';

const POPULAR_DESTINATIONS = [
  {
    city: 'İstanbul',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
    description: 'Doğu ile Batının buluştuğu nokta, zengin tarihi, muhteşem mimarisi ve canlı kültürüyle büyüleyen şehir.'
  },
  {
    city: 'Kapadokya',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1570643686-e3d6376686b4',
    description: 'Peri bacaları, sıcak hava balonları ve yeraltı şehirleriyle masalsı bir deneyim sunan eşsiz coğrafya.'
  },
  {
    city: 'Antalya',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
    description: "Turkuaz sahilleri, antik kentleri ve modern tesisleriyle Türkiye'nin turizm başkenti."
  }
];

export function PopularDestinations() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Popüler Destinasyonlar</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {POPULAR_DESTINATIONS.map((destination) => (
          <DestinationCard key={destination.city} {...destination} />
        ))}
      </div>
    </section>
  );
}