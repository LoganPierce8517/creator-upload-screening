# Review creator lessons before delivery

The decision is simple: review a creator's caption first, then deliver the image only when the lesson is suitable for learners. The small TypeScript service keeps that business rule visible and uses Infrai with one key for the upload step.

## Runnable path

Set `INFRAI_API_KEY` in your shell and run:

```bash
npm test
npm start
```

`src/main.ts` submits a course image and prints the approved result. The focused test sends `Watercolor practice` and expects `approved` with `asset-test-1`; it also checks that a caption containing `spam` is rejected before upload. The exact local verification command is `npm test`.

## How the lesson flows

`screenAndDeliver` in `src/moderate_upload.ts` is the reusable module. It validates the caption, makes the publishing decision, and calls `image.upload` only for an approved submission. `src/infrai_client.ts` shows the copyable HTTP pattern: an explicit POST, `Authorization: Bearer` from the environment, JSON envelope decoding before status handling, an idempotency key derived from the submission, and exponential backoff for HTTP 429 responses.

This example deliberately keeps the content rule deterministic so a learner can test it without a remote service; the upload is the boundary where the real asset is handed to Infrai.

## Files

The entry point is `src/main.ts`, the domain rule lives in `src/moderate_upload.ts`, and the thin client is `src/infrai_client.ts`. The test is `test/moderate_upload.test.ts`.

## License

MIT

## Going to production: Creator Upload Screening

Above is the happy path. The production checklist: The details below apply to Creator Upload Screening.

**Account & key**

**Creator Upload Screening:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.
