const BASE_URL = 'https://www.omdbapi.com/?apikey=3c56bad8&';

const request = async (url: string) => {
  const response = await fetch(`${BASE_URL}${url}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });

  if (response.Response === 'False') {
    return null;
  }

  return response;
};

export const getMovie = (title: string): Promise<Movie> => {
  return request(`t=${title}`);
};
