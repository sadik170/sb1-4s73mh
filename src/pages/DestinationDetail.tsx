// src/pages/DestinationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Globe, Calendar, Utensils, Car, Camera, Heart } from 'lucide-react';
import { getCityImage } from '../lib/pixabay';
import { getDestinationInfo } from '../lib/gemini';
import { getWikipediaInfo } from '../lib/wikipedia';
import { ErrorMessage } from '../components/ErrorMessage';

interface DestinationInfo {
  imageUrl: string;
  description: string;
  wikiUrl?: string;
  weather?: string;
  bestTime?: string;
  localFood?: string[];
  transportation?: string[];
  attractions?: string[];
}

export function DestinationDetail() {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo | null>(null);
  const [isLiked, setIsLiked] = useState(false);

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

        // Burada description'ı parse ediyoruz
        const sections = description.split('\n\n').filter(Boolean);
        
        setDestinationInfo({
          imageUrl,
          description: sections[0] || '', // Ana açıklama
          wikiUrl: wikiInfo?.url,
          bestTime: sections.find(s => s.includes('Ziyaret'))?.replace('En İyi Ziyaret Zamanı:', '').trim(),
          localFood: sections.find(s => s.includes('Yerel'))?.split('\n').slice(1),
          transportation: sections.find(s => s.includes('Ulaşım'))?.split('\n').slice(1),
          attractions: sections.find(s => s.includes('Turistik'))?.split('\n').slice(1),
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

  const InfoCard = ({ title, children, icon: Icon }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon size={24} className="text-blue-600" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gray-300 rounded-xl" />
            <div className="h-8 bg-gray-300 rounded w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-xl" />
              ))}
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
      <div className="relative h-[70vh]">
        <img
          src={destinationInfo.imageUrl}
          alt={cityName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-8 pb-12">
            <button
              onClick={() => navigate('/')}
              className="mb-4 text-white hover:text-gray-200 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Geri Dön
            </button>
            <div className="flex justify-between items-end">
              <h1 className="text-5xl font-bold text-white capitalize">
                {decodeURIComponent(cityName)}
              </h1>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                <Heart 
                  size={24} 
                  className={isLiked ? "text-red-500 fill-red-500" : "text-white"} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genel Bilgi */}
          <InfoCard title="Genel Bilgi" icon={Globe}>
            <p className="text-gray-600 leading-relaxed">
              {destinationInfo.description}
            </p>
            {destinationInfo.wikiUrl && (
              <a
                href={destinationInfo.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Globe size={16} />
                Wikipedia'da İncele
              </a>
            )}
          </InfoCard>

          {/* En İyi Ziyaret Zamanı */}
          <InfoCard title="En İyi Ziyaret Zamanı" icon={Calendar}>
            <p className="text-gray-600">
              {destinationInfo.bestTime || "Tüm yıl boyunca ziyaret edilebilir."}
            </p>
          </InfoCard>

          {/* Gezilecek Yerler */}
          {destinationInfo.attractions && (
            <InfoCard title="Gezilecek Yerler" icon={Map}>
              <ul className="space-y-3">
                {destinationInfo.attractions.map((place, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Camera size={18} className="text-blue-600 mt-1" />
                    <span className="text-gray-600">{place}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Yerel Lezzetler */}
          {destinationInfo.localFood && (
            <InfoCard title="Yerel Lezzetler" icon={Utensils}>
              <ul className="space-y-3">
                {destinationInfo.localFood.map((food, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-2xl">🍴</span>
                    <span className="text-gray-600">{food}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* Ulaşım Bilgileri */}
          {destinationInfo.transportation && (
            <InfoCard title="Ulaşım Bilgileri" icon={Car}>
              <ul className="space-y-3">
                {destinationInfo.transportation.map((info, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Car size={18} className="text-blue-600 mt-1" />
                    <span className="text-gray-600">{info}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
        </div>
      </div>
    </div>
  );
}