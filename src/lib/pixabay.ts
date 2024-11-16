// src/lib/pixabay.ts

const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export const getCityImage = async (city: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
        city + ' city landmark'
      )}&image_type=photo&orientation=horizontal&per_page=3&category=places`
    );

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      // Rastgele bir görsel seç (ilk 3 sonuçtan)
      const randomIndex = Math.floor(
        Math.random() * Math.min(3, data.hits.length)
      );
      return data.hits[randomIndex].webformatURL;
    }

    // Eğer görsel bulunamazsa default görsel
    return '/images/default-city.jpg';
  } catch (error) {
    console.error('Error fetching image:', error);
    return '/images/default-city.jpg';
  }
};
