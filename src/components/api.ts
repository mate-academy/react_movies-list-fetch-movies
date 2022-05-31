
   
const URL = 'https://www.omdbapi.com/?apikey=e10e36ec&t=';

export async function getMovie(title: string) {
  const response = await fetch(URL + title);

  return response.json();
}
