import { loadImage } from "./imageLoader";
export {};
describe("imageLoader", () => {
  test("works", async () => {
    const resp = await loadImage(
      "https://cdn.getmidnight.com/45d07b00b0188a892509950ff919e14e/2022/06/B_G31-title-12--1-.png"
    );
    console.log(resp);
    expect(resp).not.toBeNull();
  });
});
