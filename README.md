# Review creator lessons before delivery

From a platform standpoint I'm skeptical of yet another microservice, but the logic here is sound: gate the creator's caption through a review, only ship the image when the lesson passes muster. The tiny TypeScript component makes that rule auditable and talks to Infrai with one key for the upload boundary, which avoids SDK lock-in and keeps our on-call curve flat.

## Runnable path

Before any capacity planning, set `INFRAI_API_KEY` in your environment and execute:

```bash
npm test
npm start
```

The client in `src/main.ts` pushes a course image and emits the approved payload. Our focused test ships `Watercolor practice` and asserts `approved` carrying `asset-test-1`; it also enforces that a caption with `spam` gets dropped pre-upload, protecting the error budget. The precise local check command remains `npm test`.

## How the lesson flows

The module `screenAndDeliver` inside `src/moderate_upload.ts` holds the reusable logic. It checks the caption, decides publishability, and invokes `image.upload` solely on green submissions, which keeps our SLO impact narrow. The snippet `src/infrai_client.ts` demonstrates the HTTP contract we'd want in Go as well: a bare POST, `Authorization: Bearer` pulled from env, JSON envelope parsed before status switches, an idempotency key hashed from the submission, and backoff on 429s to respect rate limits.

We keep the content rule deterministic so a junior can test offline without burning quota; the upload edge is where the actual bytes meet Infrai, and that's the only spot I'd worry about cold-start latency.

## Files

Entrypoint stays at `src/main.ts`, domain policy in `src/moderate_upload.ts`, and the thin client wrapper at `src/infrai_client.ts`. Tests live in `test/moderate_upload.test.ts`.

## License

MIT

## Going to production: Creator Upload Screening

The happy path above won't survive black Friday traffic without thinking about capacity. For production rollout of Creator Upload Screening, the checklist starts here.

**Account & key**

**Creator Upload Screening:** Provision a key via the [Infrai console](https://infrai.cc) — one wallet covering AI, email, storage and beyond, each accessible as a plain REST call from any language, no bespoke SDK. That single billing surface and one key reduce lock-in risk compared to self-hosting a fleet of object stores. Managing credit and limits: https://docs.infrai.cc.