const API_URL = 'http://www.omdbapi.com/?apikey=4d03bd25';

export const getMovie = async (title: string): Promise<ApiMovie> => {
  const response = await fetch(`${API_URL}&t=[${title}]`);

  return response.json();
};
