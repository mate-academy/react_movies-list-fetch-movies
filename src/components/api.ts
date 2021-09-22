const BASE_URL = 'https://www.omdbapi.com/?apikey=b6b0e744&';

export const getMovie = async (movieName:string) => {
  const response = await fetch(`${BASE_URL}&t=${movieName}`);

  if (response.ok) {
    return response.json();
  }

  return 'no data';
};
