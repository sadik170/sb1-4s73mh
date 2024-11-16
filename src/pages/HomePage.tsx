// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { Compass, Globe, Menu } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CityGrid } from '../components/CityGrid';
import { DestinationCard } from '../components/DestinationCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { getDestinationInfo } from '../lib/gemini';
import { getWikipediaInfo } from '../lib/wikipedia';
import type { SearchResult } from '../types';

export function HomePage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const [geminiInfo, wikiInfo] = await Promise.all([
        getDestinationInfo(query),
        getWikipediaInfo(query),
      ]);

      setSearchResult({
        city: query,
        country: 'Belirlenecek',
        description: geminiInfo,
        imageUrl:
          wikiInfo?.thumbnail ||
          `https://source.unsplash.com/featured/?${encodeURIComponent(
            query
          )},city`,
        wikiUrl: wikiInfo?.url,
      });
    } catch (err) {
      setError('Bilgiler alınırken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Compass className="text-blue-600" size={32} />
              <span className="text-xl font-bold">GeziAI</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#sehirler" className="text-gray-600 hover:text-blue-600">
                Şehirler
              </a>
              <a
                href="#ozellikler"
                className="text-gray-600 hover:text-blue-600"
              >
                Özellikler
              </a>
              <button className="btn btn-primary">Seyahatini Planla</button>
            </div>

            <button className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dünya Şehirlerini Keşfet
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Yapay zeka destekli içgörüler ve yerel uzmanlıkla şehirleri keşfet
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading && <DestinationCard loading={true} />}
        {error && <ErrorMessage message={error} />}
        {searchResult && !loading && <DestinationCard {...searchResult} />}
        {!searchResult && !loading && (
          <section id="sehirler">
            <h2 className="text-3xl font-bold text-center mb-8">
              Dünya'nın Önemli Şehirleri
            </h2>
            <CityGrid />
          </section>
        )}
      </main>

      <section id="ozellikler" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Neden AI ile Seyahat?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Akıllı Öneriler</h3>
              <p className="text-gray-600">
                Yapay zeka destekli kişiselleştirilmiş seyahat önerileri
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GeziAI Hakkında</h3>
              <p className="text-gray-400">Yapay zeka ile dünyayı keşfedin</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} GeziAI. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
