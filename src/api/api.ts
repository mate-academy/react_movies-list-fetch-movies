export const fetchMovie = async (title: string) => {
  const response = await fetch(`http://www.omdbapi.com/?apikey=678cb8a2&t=${title}`);
  const data = response.json();

  return data;
};
