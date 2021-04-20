export function findMovie(title, setNewMovie, setError) {
  return fetch(`https://www.omdbapi.com/?apikey=86edde0e&t=${title}`)
    .then(response => response.json())
    .then(result => (result.Error ? setError(true) : setNewMovie(result)));
}
