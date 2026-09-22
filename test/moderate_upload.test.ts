import { screenAndDeliver } from "../src/moderate_upload.ts";
const equal = (a: unknown, b: unknown) => { if (a !== b) throw new Error(`Expected ${String(b)}, got ${String(a)}`); };
const deepEqual = (a: unknown, b: unknown) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error("Results differ"); };

const fakeClient = { upload: async () => ({ id: "asset-test-1" }) };
const approved = await screenAndDeliver({ creatorId: "teacher-1", caption: "Watercolor practice", image: "bytes", filename: "art.png" }, fakeClient);
deepEqual(approved, { decision: "approved", reason: "Caption passed the classroom-friendly review.", assetId: "asset-test-1" });
const rejected = await screenAndDeliver({ creatorId: "teacher-1", caption: "This is spam", image: "bytes", filename: "art.png" }, fakeClient);
equal(rejected.decision, "rejected");
console.log("moderation decisions: approved and rejected as expected");
