import { getPreviewFromContent } from "link-preview-js";
import { request } from "obsidian";

export interface IPreview {
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
  //   const respBody = await fetch(url, {
  //     mode: "no-cors",
  //   })
  //     .then((response) => {
  //       console.log("fetch", response);
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  //   console.log("respBody", respBody);
  const resp: any = await new Promise(async (resolve, reject) => {
    const timeO = setTimeout(() => {
      reject(new Error("превышено время ожидания ответа"));
    }, timeout);
    // console.log("urlPreview>", url);
    const myRequest = await request(url);
    // console.log("myRequest", myRequest);
    const resource: {
      headers: Record<string, string>;
      status?: number;
      imagesPropertyType?: string;
      proxyUrl?: string;
      url: string;
      data: string;
    } = {
      headers: {},
      url: url,
      data: myRequest,
    };
    getPreviewFromContent(resource)
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
