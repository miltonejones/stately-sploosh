const API_ENDPOINT = "https://jhdcmv7zhi.execute-api.us-east-1.amazonaws.com";

export const getJavKeys = async (path) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  };
  const response = await fetch(API_ENDPOINT + `/list`, requestOptions);
  return await response.json();
};

export const searchJavdo = async (key) => {
  const response = await fetch(API_ENDPOINT + `/find/${key}`);
  return await response.json();
};

// requestOptions
