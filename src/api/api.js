const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=6811da81&';

const getData = param => (fetch(`${BASE_URL}${param}`).then((response) => {
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}));

export const getMovie = title => getData(`t=${title}`);
