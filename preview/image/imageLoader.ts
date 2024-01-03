import { RequestUrlResponsePromise, requestUrl } from "obsidian";

export const loadImage = async (
  url: string
): Promise<RequestUrlResponsePromise> => {
  return new Promise(
    async (resolve, reject): Promise<RequestUrlResponsePromise> => {
      const timeO = setTimeout(() => {
        reject(new Error("превышено время ожидания ответа"));
      }, 30000);
      const myRequest = await requestUrl(url);
      clearTimeout(timeO);
      resolve(myRequest);
      return myRequest;
    }
  );
};
