import requestMock from "@/utils/request-mock";

enum Api {
  getHomeDataUrl = "/home/data",
}

export const getHomeDataApi = () => {
  return requestMock.get<any, any>(Api.getHomeDataUrl);
};
