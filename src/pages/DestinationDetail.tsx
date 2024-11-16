// src/pages/DestinationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Globe } from 'lucide-react';
import { getCityImage } from '../lib/pixabay';
import { getDestinationInfo } from '../lib/gemini';
import { getWikipediaInfo } from '../lib/wikipedia';
import { ErrorMessage } from '../components/ErrorMessage';

interface DestinationInfo {
  imageUrl: string;
  description: string;
  wikiUrl?: string;
  highlights?: string[];
}

export function DestinationDetail() {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destinationInfo, setDestinationInfo] =
    useState<DestinationInfo | null>(null);

  useEffect(() => {
    const loadDestinationInfo = async () => {
      if (!cityName) return;

      try {
        const decodedCityName = decodeURIComponent(cityName);

        const [imageUrl, description, wikiInfo] = await Promise.all([
          getCityImage(decodedCityName),
          getDestinationInfo(decodedCityName),
          getWikipediaInfo(decodedCityName),
        ]);

        setDestinationInfo({
          imageUrl,
          description,
          wikiUrl: wikiInfo?.url,
          highlights: [
            '🏛️ Tarihi Yerler ve Mimari',
            '🍴 Yerel Mutfak ve Lezzetler',
            '🎨 Kültür ve Sanat',
            '🌳 Doğal Güzellikler',
          ],
        });
      } catch (err) {
        setError('Şehir bilgileri yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDestinationInfo();
  }, [cityName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-xl mb-8" />
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-300 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destinationInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message={error || 'Şehir bilgisi bulunamadı.'} />
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={destinationInfo.imageUrl}
          alt={cityName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-8 pb-8">
            <button
              onClick={() => navigate('/')}
              className="mb-4 text-white hover:text-gray-200 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Geri Dön
            </button>
            <h1 className="text-4xl font-bold text-white capitalize">
              {decodeURIComponent(cityName)}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Şehir Hakkında</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {destinationInfo.description}
          </p>

          {destinationInfo.wikiUrl && (
            <a
              href={destinationInfo.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Globe size={20} />
              Wikipedia'da İncele
            </a>
          )}
        </div>

        {destinationInfo.highlights && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Öne Çıkanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinationInfo.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg flex items-center gap-3"
                >
                  <Map size={20} className="text-blue-600" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
