import { IPreview } from "./preview";

export class PreviewFrame {
  container: HTMLDivElement;
  urlFrame: HTMLDivElement;
  settingsFrame: HTMLDivElement;
  data: IPreview;
  previewFrameBlocks: {
    title: HTMLDivElement;
    description: HTMLDivElement;

    imageContainer: HTMLDivElement;
    image: HTMLDivElement;
  } = {
    title: document.createElement("div"),
    description: document.createElement("div"),
    imageContainer: document.createElement("div"),
    image: document.createElement("div"),
  };
  style: {
    title: {
      fontSize: number;
    };
    description: {
      fontSize: number;
    };
    image: {
      width: number;
      height: number;
    };
  };

  constructor(container: HTMLDivElement, data: IPreview) {
    this.container = container;
    this.data = data;
    this.style = {
      title: {
        fontSize: 18,
      },
      description: {
        fontSize: 16,
      },
      image: {
        width: 100,
        height: 100,
      },
    };
    //    this.settingsFrame = this.createSettingsFrame();
    this.urlFrame = this.defaultFrame();
  }
  createSettingsFrame(): HTMLDivElement {
    const settingsFrame = this.container.createDiv();
    settingsFrame.addClass("settings");
    settingsFrame.createEl("div", {
      text: "Settings",
    });
    //  <input type="range" min="1" max="100" value="50">
    const imageRanger = settingsFrame.createEl("input", {
      attr: {
        type: "range",
        min: "1",
        max: "100",
        value: "100",
      },
      text: "Image",
    });
    imageRanger.addEventListener("input", (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      this.style.image.width = parseInt(value);
      this.style.image.height = parseInt(value);
      // this.urlFrame.setCssStyles(this.style.image);
      this.previewFrameBlocks.image.setCssStyles({
        //   width: "100%",
        width: this.style.image.width + "%",
        //height: this.style.image.height + "px",
      });
    });
    return settingsFrame;
  }
  defaultFrame(): HTMLDivElement {
    const frame = this.container.createDiv();
    frame.addClass("identify-frame");
    // frame.createEl("div", {
    //   text: "Preview",
    // });
    // .preview {
    // 	display: grid;
    // 	grid-template-columns: 1fr 1fr;
    // 	grid-gap: 10px;
    // 	border: #5e5c5c solid 1px;
    // }
    frame.setCssStyles({
      display: "grid",
      //   gridTemplateColumns: "1fr 1fr",//TODO add for horizontal split
      gridGap: "10px",
      border: "#5e5c5c solid 1px",
    });
    // const previewDiv = document.createElement("div");
    // previewDiv.classList.add("preview");
    const imageContainer = frame.createEl("div", {
      cls: "identify-image",
    });
    // padding: 10px;
    // 	display: grid;
    // 		justify-content: center;
    // 		align-content: space-evenly;
    imageContainer.setCssStyles({
      padding: "10px",
      display: "grid",
      justifyContent: "center",
      alignContent: "space-evenly",
    });
    this.previewFrameBlocks.imageContainer = imageContainer;
    // const imageDiv = previewDiv.createDiv({ cls: "image" });
    const image = imageContainer.createEl("img", {
      cls: "identify-preview-image",
      attr: {
        src:
          this.data.images.length > 0
            ? this.data.images[0]
            : this.data.favicons[0] || "",
        alt: "Изображение",
      },
    });
    // .preview-image {
    // 	width: 100%;

    // }
    image.setCssStyles({
      //   width: "100%",
      width: this.style.image.width + "%",
      //height: this.style.image.height + "px",
    });
    this.previewFrameBlocks.image = image;

    const infoDiv = frame.createEl("div", {
      cls: "identify-info",
    });
    // .info {
    // 	padding: 10px;
    // }
    infoDiv.setCssStyles({
      padding: "10px",
    });
    //  const infoDiv = previewDiv.createDiv({ cls: "info" });
    //  const titleEl = infoDiv.createEl("h2", { cls: "title", text: title });
    const link = infoDiv.createEl("a", {
      attr: {
        href: this.data.url,
      },
      cls: "identify-title",
      text: this.data.title,
    });
    // .title {
    // 	font-size: 18px;
    // 	font-weight: bold;
    // }
    link.setCssStyles({
      fontSize: this.style.title.fontSize + "px",
      fontWeight: "bold",
    });

    const descriptionEl = infoDiv.createEl("p", {
      cls: "identify-description",
      text: this.data.description,
    });
    // .description {
    // 	font-size: 16px;
    // }
    descriptionEl.setCssStyles({
      fontSize: this.style.description.fontSize + "px",
    });

    return frame;
  }
}
