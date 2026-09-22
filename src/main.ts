import { screenAndDeliver } from "./moderate_upload.ts";

const submission = { creatorId: "course-17", caption: "A hands-on lesson from my studio", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=", filename: "lesson.png" };
const result = await screenAndDeliver(submission);
console.log(JSON.stringify(result, null, 2));
