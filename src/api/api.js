const API_URL = `https://www.omdbapi.com/`;

export const fetchMovie = async(title) => {
  const movie = await fetch(
    `${API_URL}?apikey=5a54f262&t=${title}`,
  );

  return movie.json();
};
