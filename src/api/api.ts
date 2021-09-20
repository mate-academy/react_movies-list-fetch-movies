const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=b8ded547';

export const getMovies = async (title: string) => {
  const response = await fetch(`${API_URL}&t=${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
};

// eslint-disable-next-line no-console
console.log(getMovies);
