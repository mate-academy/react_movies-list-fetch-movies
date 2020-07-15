export const fetchMovie = async <T>(title: string): Promise<T> => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=678cb8a2&t=${title}`);
  const data = response.json();

  return data;
};
