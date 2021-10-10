const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=20bbe522&t=';

export const getMovie = async (title: string): Promise<Movie> => {
  const response = await fetch(`${API_URL}${title}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.text}`);
  }

  const data = response.json();

  return data;
};
