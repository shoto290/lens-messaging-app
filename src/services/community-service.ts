import { Community } from "./community-service.types";

const COMMUNITY_MOCK_DATA: Community[] = [
  {
    id: "1",
    name: "Pudgy Penguins",
    description: "Community 1 description",
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fbafybeia7qfyvgwfxkhwjoorxqe6nezjk7jqv3bblo4cbs4hpjcecnky4vy.ipfs.w3s.link%2FIMG_6833.png",
    members: ["1", "2", "3"],
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
  },
  {
    id: "2",
    name: "Doodle",
    description: "Community 2 description",
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmainnet%2Fz9JRSpLYGu7%252BCZoKWtAuAI8ipNM7MJ1GQZfU57rB7lIEyx%252FONfn5NjLUzG%252FzZsB4eeY3HDjf3tMPF6UwbHrdugzI82FcZAJinIUWgzzPszDd4azmgzo%252Bu%252FCbchegsoWnZge%252Fwnzf5OQoixgL%252FGnS%252Bw%253D%253D",
    members: ["1", "2", "3"],
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
  },
  {
    id: "3",
    name: "Azuki",
    description: "Community 3 description",
    image:
      "https://img-cdn.magiceden.dev/rs:fill:400:0:0/plain/https%3A%2F%2Fimg.reservoir.tools%2Fimages%2Fv2%2Fmainnet%2Fz9JRSpLYGu7%252BCZoKWtAuAGpnDPPI%252BsrhYBKQuBYc6XZMHTg6SSHih%252BOpmF%252FwAS4qY4NdVw4CAhgA1Wbpkx5GEXUwbgPcTN51MGZZWQi4%252FXlqxGoEDq%252FdAAlbOf2MwsZeMqMtUcF4j9cSCSDQMIVxbE%252FH2GQQzLcaEiWTS7%252Br1jEJDCE%252BYyhgHNXRacqbg83%252ByxJPUwfNMrixZnYzXFGecg%253D%253D",
    members: ["1", "2", "3"],
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
  },
];

const getCommunities = async () => {
  return COMMUNITY_MOCK_DATA;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCommunitiesOfUser = async (profileId: string) => {
  return COMMUNITY_MOCK_DATA;
};

export const communityService = {
  getCommunities,
  getCommunitiesOfUser,
};
