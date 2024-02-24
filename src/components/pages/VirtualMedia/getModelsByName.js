const getModelsByName = async (name) => {
  const response = await fetch(API_ENDPOINT + `/model-name/${name}`);
  return await response.json();
};
