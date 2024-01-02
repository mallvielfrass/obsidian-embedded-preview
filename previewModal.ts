import { App, Modal } from "obsidian";
import { IPreview, urlPreview } from "preview/preview";

import { isUri } from "valid-url";

export class URLPreviewModal extends Modal {
  app: App;
  constructor(app: App) {
    super(app);
  }
  async fetchForm(
    url: string,
    inputEl: HTMLInputElement,
    resultContainer: HTMLDivElement
  ) {
    console.log("fetch form", url);
    resultContainer.empty();
    if (!isUri(url)) {
      console.log("url is not valid");
      inputEl.addClass("error");
      return;
    }
    console.log("url is valid");
    inputEl.removeClass("error");
    try {
      const resp = await urlPreview(url);
      console.log("resp", resp);
      this.mountPreview(resp);
    } catch (error) {
      console.log("error", error);
      resultContainer.createEl("div", {
        text: "Error: " + error,
        cls: "error",
      });
    }
  }
  onOpen(): void {
    const { contentEl } = this;
    let url = "";
    const header = contentEl.createDiv({
      cls: "header",
      text: "URL Preview Modal",
    });
    //add form input
    const inputContainer = contentEl.createDiv({
      cls: "input-container",
    });
    const resultContainer = contentEl.createDiv({
      cls: "result-container",
    });
    inputContainer.createEl("div", {
      text: "Enter URL:",
    });
    const inputEl = inputContainer.createEl("input", {
      attr: {
        type: "text",
        placeholder: "Enter URL",
      },
    });
    //run button with icon play
    const fetchButton = inputContainer.createEl("button", {
      cls: "fetch-button",
    });
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    fetchButton.innerHTML = iconSvg;

    fetchButton.addEventListener("click", (event: Event) => {
      // const value = (event.target as HTMLInputElement).value;
      this.fetchForm(url, inputEl, resultContainer);
    });
    inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        this.fetchForm(url, inputEl, resultContainer);
      }
    });
    inputEl.addEventListener("input", (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      url = value;
      console.log("value", value);
    });
  }
  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }

  async mountPreview(prev: IPreview) {
    try {
      const { contentEl } = this;
      const frame = contentEl.createDiv();
      const testDiv = frame.createEl("div", {
        cls: "test",
        text: "Test",
      });

      const previewDiv = await this.createPreviewDiv(prev);
      frame.appendChild(previewDiv);
    } catch (error) {
      console.log("error", error);
    }
  }
  async createPreviewDiv(data: IPreview): Promise<HTMLDivElement> {
    const { url, title, description, favicons, images } = data;

    const previewDiv = document.createElement("div");
    previewDiv.classList.add("preview");

    const imageDiv = previewDiv.createDiv({ cls: "image" });
    const image = imageDiv.createEl("img", {
      cls: "preview-image",
      attr: {
        src: images[0],
        alt: "Изображение",
      },
    });

    const infoDiv = previewDiv.createDiv({ cls: "info" });
    //  const titleEl = infoDiv.createEl("h2", { cls: "title", text: title });
    const link = infoDiv.createEl("a", {
      attr: {
        href: url,
      },
      cls: "title",
      text: title,
    });
    const descriptionEl = infoDiv.createEl("p", {
      cls: "description",
      text: description,
    });

    return previewDiv;
  }
}
