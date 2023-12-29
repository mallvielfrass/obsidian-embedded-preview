import {urlPreview} from "./preview";

describe("urlPreview", () => {
  test("works", async () => {
    const resp = await urlPreview("https://github.com", 3000);
    console.log(resp);
    expect(resp).not.toBeNull();
  });
});
