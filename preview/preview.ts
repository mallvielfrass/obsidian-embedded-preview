import {getLinkPreview, getPreviewFromContent} from "link-preview-js";

import sleep from "sleep-promise";
interface IPreview {
  url: string;
  title: string;
  description: string;

  favicons: string[];
  images: string[];
}
export async function urlPreview(
  url: string,
  timeout = 30000
): Promise<IPreview> {
  const resp: any = await new Promise((resolve, reject) => {
    const timeO = setTimeout(() => {
      reject(new Error("превышено время ожидания ответа"));
    }, timeout);

    getLinkPreview(url)
      .then(async (result) => {
        clearTimeout(timeO);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeO);
        reject(error);
      });
  });

  const title = "title" in resp ? resp.title : "";
  const description = "description" in resp ? resp?.description || "" : "";
  const images = "images" in resp ? resp.images : [];
  const favicons = "favicons" in resp ? resp.favicons : [];

  return {
    url: url,
    title: title,
    description: description,
    images: images,
    favicons: favicons,
  };
}
