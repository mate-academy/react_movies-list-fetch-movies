const MOVIES_URL = 'http://www.omdbapi.com/?apikey=e58c951a&t='
export function getMovies(title){
  return fetch(`${MOVIES_URL}${title}`)
    .then(response => response.json())
}


