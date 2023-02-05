// import React from 'react';
// import { getVideoByURL } from './ParserConnector';

const API_ENDPOINT = 'https://3bax4cg6w7.execute-api.us-east-1.amazonaws.com';
const PHOTO_ENDPOINT = 'https://58uf2seho0.execute-api.us-east-1.amazonaws.com';
const JAV_ENDPOINT = 'https://jhdcmv7zhi.execute-api.us-east-1.amazonaws.com';

export const getVideoInfo = async (key) => {
  const response = await fetch(JAV_ENDPOINT + `/${key}`);
  return await response.json();
};


export const getVideos = async (page) => {
  const response = await fetch(API_ENDPOINT + `/videos/${page}`);
  return await response.json();
};

export const getPhoto = async (name, retry) => {
  const response = await fetch(PHOTO_ENDPOINT + `/${name}/1`);
  return await response.json(); 
 
};

export const getVideosByDomain = async (domain, page) => {
  const response = await fetch(API_ENDPOINT + `/domain/${domain}/${page}`);
  return await response.json();
};

export const getModels = async (page) => {
  const response = await fetch(API_ENDPOINT + `/models/${page}`);
  return await response.json();
};

export const getFavorites = async (page) => {
  const response = await fetch(API_ENDPOINT + `/favorite/${page}`);
  return await response.json();
};

export const getVideo = async (id) => {
  const response = await fetch(API_ENDPOINT + `/video/${id}`);
  return await response.json();
};

export const deleteVideo = async (id) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" } 
  };
  const response = await fetch(API_ENDPOINT + '/video/' + id, requestOptions);
  return await response.json();
};

export const getModel = async (id, page = 1, favorite = false, param) => {
  const suffix = favorite ? '/1' : '';
  let address = `/model/${id}/${page}${suffix}`
  if (!!param?.length) {
   address = `/model-filter/${id}/${page}/${param}`
  }
  const response = await fetch(API_ENDPOINT + address);
  return await response.json();
};

export const findVideos = async (param, page = 1) => {
  const response = await fetch(API_ENDPOINT + `/find/${param}/${page}`);
  return await response.json();
};

// export const addVideo = async (URL) => {
//   const b = await getVideoByURL(URL);
//   const c = await saveVideo(b);  
//   return c
// };

export const getDash = async () => { 
  const response = await fetch(API_ENDPOINT + '/dash');
  return await response.json();
};

export const toggleVideoFavorite = async (ID) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ID }),
  };
  const response = await fetch(API_ENDPOINT + '/toggle-video-heart', requestOptions );
  return await response.json();
};

export const getVideoKeys = async (Keys) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Keys}),
  };
  const response = await fetch(API_ENDPOINT + '/video-ids', requestOptions);
  return await response.json();
};

export const getModelsByName = async (name) => {
  const response = await fetch(API_ENDPOINT + `/model-name/${name}`);
  return await response.json();
}

export const getModelCostars = async (id) => {
  const response = await fetch(API_ENDPOINT + `/model-costars/${id}`);
  return await response.json();
}

export const getModelMissingVideos = async (id) => {
  const response = await fetch(API_ENDPOINT + `/model-missing/${id}`);
  return await response.json();
}


export const removeModelFromVideo = async (trackFk, modelFk) => {
  const requestOptions = {
    method: "DELETE",
  };
  const response = await fetch(API_ENDPOINT + `/model/cast/${trackFk}/${modelFk}`, requestOptions);
  return await response.json();
};


export const addModelToVideo = async (trackFk, modelFk) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackFk, modelFk }),
  };
  const response = await fetch(API_ENDPOINT + '/model/cast', requestOptions);
  return await response.json();
}; 


export const addModelAlias = async (modelFk, aliasFk) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelFk, aliasFk }),
  };
  const response = await fetch(API_ENDPOINT + '/add-model-alias', requestOptions);
  return await response.json();
}



export const updateModelPhoto = async ( id, image ) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, image }),
  };
  const response = await fetch(API_ENDPOINT + '/add-model-photo', requestOptions);
  return await response.json();
}


export const getModelsByTitle = async (title) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" } ,
    body: JSON.stringify({ title }),
  };
  const response = await fetch(API_ENDPOINT + `/model-title`, requestOptions);
  return await response.json();
};


export const addModel = async (name) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" } 
  };
  const response = await fetch(API_ENDPOINT + `/model/cast/${name}`, requestOptions);
  return await response.json();
};

const formatURL = URL => {
  if (URL?.length > 255) {
    const re = /([a-z|A-Z]+-\d+)/.exec(URL);
    if (re) {
      return `https://javdoe.to/search/movie/${re[1]}`
    }
  }
  return URL;
}


export const saveVideo = async (video) => {
  const title = video.title.substr(0, 255);
  const URL =  formatURL(video.URL)
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...video, title, URL }),
  };
  try {
    const response = await fetch(API_ENDPOINT + '/video', requestOptions);
    return await response.json();
  } catch (error) {
    return { error }
  }
};