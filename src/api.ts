export const mainRequest = (filmTitle: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=edc77aa9&t=${filmTitle}`).then(response => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
};
