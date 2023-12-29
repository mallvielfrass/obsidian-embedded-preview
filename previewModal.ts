import {App, Modal} from "obsidian";
import {urlPreview} from "preview/preview";
import {isUri} from "valid-url";
export class URLPreviewModal extends Modal {
  app: App;
  constructor(app: App) {
    super(app);
  }
  onOpen(): void {
    const {contentEl} = this;
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
    async function fetchForm() {
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
      } catch (error) {
        console.log("error", error);
        resultContainer.createEl("div", {
          text: "Error: " + error,
          cls: "error",
        });
      }
    }
    fetchButton.addEventListener("click", (event: Event) => {
      // const value = (event.target as HTMLInputElement).value;
      fetchForm();
    });
    inputEl.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        fetchForm();
      }
    });
    inputEl.addEventListener("input", (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      url = value;
      console.log("value", value);
    });
  }
  onClose(): void {
    const {contentEl} = this;
    contentEl.empty();
  }
}
