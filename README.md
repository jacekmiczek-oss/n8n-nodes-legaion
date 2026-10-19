# n8n-nodes-legaion

Submit text to LEGAION for asynchronous verification and retrieve the full result.
A result supports human review; it does not automatically approve a document.

## Credentials

An administrator creates an organisation API key in LEGAION Business Panel → Administration → API Keys. Enable `engine:verify`. Paste the key into n8n's LEGAION API credential, not a workflow field. Verification may consume LEGAION credits. Revoked or expired keys stop working.

## Operations

- **Start Verification**: text (1–60,000 characters), document type, output language and a stable Request ID for the source document version. Returns a job ID and `pending` status. Reuse the Request ID after network failures; changing it can trigger another billable analysis.
- **Get Verification**: the job ID, using the same credential. Returns `pending`, `completed` or `failed`. Results expire after 24 hours.

Connect Start → Wait 5 seconds → Get → branch on status. Repeat only while pending. Stop on failed. Route completed findings to a human reviewer. `coverage: complete` describes extraction completeness, not correctness of all claims. Preserve all verdicts, including unknown and unverified.

The workflow sends selected text to LEGAION. n8n execution history may retain inputs and outputs under your instance settings. LEGAION's partner API stores temporary encrypted results for 24 hours and does not persist submitted input text. See the [API and data-handling documentation](https://rkryjteyfzgxisnmykek.supabase.co/functions/v1/partner-verification/docs).

## Development

`npm ci --ignore-scripts`, `npm run lint`, `npm run build`. There are no runtime dependencies. The package is MIT-licensed. Its source and package must be published and reviewed before it can be described as an n8n verified community node. Local build/test success is not n8n certification.

Support: support@legaion.com · [LEGAION](https://www.legaion.com/)

## Publication

Source repository: https://github.com/jacekmiczek-oss/n8n-nodes-legaion

Configure npm Trusted Publishing for this repository and `.github/workflows/publish.yml`, using the `npm-publish` environment, before dispatching the workflow. The node is not yet published to npm or verified by n8n.
