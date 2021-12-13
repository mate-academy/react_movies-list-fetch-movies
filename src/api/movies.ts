export const request = async (name: string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=42caae26&t=${name}`);

  if (!response.ok) {
    throw new Error(`ERROR - ${response.statusText}`);
  }

  return response.json();
};
