const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=3dd44c04';

export const getMovie = async (title: string) => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status}, ${response.text}`);
  }

  return response.json();
};
