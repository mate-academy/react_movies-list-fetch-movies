const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=1cb98745';

export const request = (tittle: string) => {
  const data = fetch(`${API_URL}&t=${tittle}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });

  return data;
};
