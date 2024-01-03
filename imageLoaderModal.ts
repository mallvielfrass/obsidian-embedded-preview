import { App, Modal } from "obsidian";

import { isUri } from "valid-url";
import { loadImage } from "./preview/image/imageLoader";

let decode = require("image-decode");
export class ImageLoaderModal extends Modal {
  app: App;
  containerModal: HTMLDivElement;
  data: {
    original: ArrayBuffer;
    origWidth: number;
    origHeight: number;
    scale: number;
  };
  image: HTMLImageElement;
  imgContainer: HTMLDivElement;
  constructor(app: App) {
    super(app);
    const { contentEl } = this;
    this.containerModal = contentEl.createDiv();
    this.data = {
      original: new ArrayBuffer(0),
      origWidth: 0,
      origHeight: 0,
      scale: 0,
    };
  }
  onOpen(): void {
    let url = "";
    const header = this.containerModal.createDiv({
      cls: "header",
      text: "Image Loader Modal",
    });
    //add form input

    const inputContainer = this.containerModal.createEl("input", {
      attr: {
        type: "text",
        placeholder: "Enter URL",
        value: url,
      },
    });
    inputContainer.addEventListener("input", (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      url = value;
      console.log("value", value);
    });
    inputContainer.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        this.fetchForm(url);
      }
    });
    //add button run this.Loader()

    const fetchButton = this.containerModal.createEl("button", {
      cls: "fetch-button",
      text: "Fetch",
    });
    fetchButton.addEventListener("click", async () => {
      this.fetchForm(url);
    });
    const imgContainer = this.containerModal.createDiv();
    this.imgContainer = imgContainer;
  }
  async fetchForm(url: string) {
    console.log("fetch form", url);
    try {
      if (!isUri(url)) {
        console.log("url is not valid");
        return;
      }
      console.log("url is valid");
      this.loader(url);
    } catch (error) {
      console.log("error", error);
    }
  }
  async loader(
    url: string //= "https://cdn.getmidnight.com/45d07b00b0188a892509950ff919e14e/2022/06/B_G31-title-12--1-.png"
  ) {
    try {
      const resp = await loadImage(url);
      //convert to base64
      const bytedBody = resp.arrayBuffer;

      let res = decode(bytedBody);
      const data = res?.data;
      if (!data) {
        throw new Error("No data");
      }
      const width = res?.width;
      const height = res?.height;
      if (!width || !height) {
        throw new Error("No width or height");
      }

      // console.log("data", data);
      console.log("width", width);
      console.log("height", height);
      this.data.original = data;
      this.data.origWidth = width;
      this.data.origHeight = height;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Создаем ImageData из ArrayBuffer
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      );

      // Устанавливаем размер холста
      canvas.width = width;
      canvas.height = height;

      // Рисуем ImageData на холсте
      context?.putImageData(imageData, 0, 0);

      // Получаем изображение в формате base64
      const imageBase64 = canvas.toDataURL("image/*");

      //   console.log("Image:", imageBase64);

      const targetWidth = 100;
      const scaleFactor = targetWidth / width;
      const targetHeight = Math.round(height * scaleFactor);

      const canvasRezised = document.createElement("canvas");
      canvasRezised.width = targetWidth;
      canvasRezised.height = targetHeight;

      // Рисуем изображение на canvas с новыми размерами
      const contextRezised = canvasRezised.getContext("2d");
      contextRezised?.drawImage(canvas, 0, 0, targetWidth, targetHeight);

      // Получаем измененное изображение в формате base64
      const resizedImageBase64 = canvasRezised.toDataURL("image/*");

      this.imgContainer.createEl("img", {
        attr: {
          src: resizedImageBase64,
          alt: "image",
        },
      });
      //   const image = decodeImage(imageBuffer);
      //   // Устанавливаем обработчик события onload
      //   image.onload = function () {
      //     // Получаем ширину и высоту изображения
      //     const width = this.naturalWidth;
      //     const height = this.naturalHeight;

      //     // Создаем элемент canvas
      //     const canvas = document.createElement("canvas");
      //     const context = canvas.getContext("2d");

      //     // Устанавливаем размер холста на основе ширины и высоты изображения
      //     canvas.width = width;
      //     canvas.height = height;

      //     // Рисуем изображение на холсте
      //     context.drawImage(image, 0, 0);

      //     // Получаем данные изображения с холста
      //     const imageData = context.getImageData(0, 0, width, height);

      //     console.log("Image width:", width);
      //     console.log("Image height:", height);
      //   };

      //   // Создаем Blob из ArrayBuffer
      //   const blob = new Blob([arrayBuffer]);

      //   // Устанавливаем источник изображения как объект Blob
      //   image.src = URL.createObjectURL(blob);

      //   const blob = new Blob([bytedBody]);
      //   console.log("blob", blob);
      //   const image = new Image();
      //   image.src = URL.createObjectURL(blob);
      // 	const imageData = new ImageData(
      //   new Uint8ClampedArray(bytedBody),
      //   width,
      //   height
      // );

      //   const originalWidth = image.width;
      //   const originalHeight = image.height;
      //   console.log("originalWidth", originalWidth);
      //   console.log("originalHeight", originalHeight);
      //   const base64 = Buffer.from(bytedBody).toString("base64");
      //   //add image to contentEl
      //   const imageFrame = this.containerModal.createEl("img", {
      //     attr: {
      //       src: `data:image/*;base64,${base64}`,
      //       alt: "Image",
      //       width: "100px",
      //     },
      //   });
      //   this.image = imageFrame;
    } catch (error) {
      console.log("error", error);
    }
    // console.log(resp);
  }
}
