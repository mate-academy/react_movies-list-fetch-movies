const API_URL = `https://www.omdbapi.com/`;

export const fetchMovie = async(title) => {
  const movie = await fetch(`${API_URL}?apikey=a1b73f92&t=${title}`);

  return movie.json();
};
