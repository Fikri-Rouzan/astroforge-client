const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_CONFIG = {
  baseUrl: BASE_URL,
  endpoints: {
    auth: {
      challenge: `${BASE_URL}/auth/challenge`,
      login: `${BASE_URL}/auth/login`,
    },
    player: {
      profile: `${BASE_URL}/player/profile`,
    },
    mining: {
      launch: `${BASE_URL}/mining/launch`,
      claim: `${BASE_URL}/mining/claim`,
    },
    spaceport: {
      refuel: `${BASE_URL}/spaceport/refuel`,
      upgrade: `${BASE_URL}/spaceport/upgrade`,
    },
    web3: {
      withdrawal: `${BASE_URL}/web3/withdrawal`,
    },
  },
};
