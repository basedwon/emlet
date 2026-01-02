# Emlet

> **An embedding engine built for the sovereign web.**

[![npm](https://img.shields.io/npm/v/emlet?style=flat&logo=npm)](https://www.npmjs.com/package/emlet)
[![pipeline](https://gitlab.com/basedwon/emlet/badges/master/pipeline.svg)](https://gitlab.com/basedwon/emlet/-/pipelines)
[![license](https://img.shields.io/npm/l/emlet)](https://gitlab.com/basedwon/emlet/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/emlet)](https://www.npmjs.com/package/emlet) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/basedwon/emlet)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/emlet)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

Emlet is a fast, fully self-contained semantic embedding engine designed to run anywhere JavaScript runs—browser, Node, edge, offline. No dependencies, no GPU, no network calls. Just load and embed.

The entire engine fits in 1 MB and produces deterministic vector embeddings suitable for similarity search, clustering, retrieval, tagging, or downstream ML workflows.

## Features

- 100M parameters, ~1MB total size
- 7K tokens/sec throughput (in the browser)
- Deterministic output (same input → same vector)
- Out-of-vocabulary synthesis (no missing tokens)
- Unicode-aware (text, emoji, symbols, ZWJ)
- Configurable vector size (1-1568D)
- Offline-first, zero dependencies
- Vanilla JavaScript, edge-ready
- No GPU. No cloud. No API.
- Self-extracting runtime
- Neuro-symbolic core
- A digital familiar

## Installation

```bash
npm install emlet
```

Or load directly via CDN:

```html
<script src="https://unpkg.com/emlet"></script>
```

This exposes both `emlet` (a preloaded instance) and `Emlet` (the class) globally.

## Importing

```js
// CommonJS
const emlet = require('emlet')
const { emlet, Emlet } = require('emlet')

// ESM
import emlet from 'emlet'
import { emlet, Emlet } from 'emlet'
```

## Basic Usage

```js
const vec = emlet.embed('Hello, world!')
console.log(vec)
// → [0.08, -0.01, ...] (96-dimensional vector by default)
```

The default export is a ready-to-use model instance.

## Custom Models

You can create your own instance with a different output size:

```js
const modelA = new Emlet()           // 96D default
const modelB = new Emlet(128)        // 128D output
const modelC = new Emlet(256, true)  // 256D head + 32D tail = 288D
```

### Constructor

```js
new Emlet(dim = 96, useTail = false)
```

* `dim`
  Number of dimensions to emit from the primary embedding space.

* `useTail`
  When `true`, appends a 32-dimensional “glimpse” of the full 1536D semantic space to every vector.

This allows output sizes from 1 up to 1536 dimensions, or 1568 when the tail is enabled.

## Out-of-Vocabulary Synthesis

Tokens not present in the internal vocabulary are synthesized deterministically:

```js
emlet.embed('quantaflux')
```

There are no unknown tokens and no fallbacks to zero vectors.

## Unicode and Emoji Support

Emlet natively handles Unicode symbols, emoji, modifiers, and ZWJ sequences:

```js
emlet.embed('🦄')
emlet.embed('👩🏽‍🚀')
```

These are embedded consistently and can be compared using standard vector similarity.

## Punctuation Handling

Punctuation is normally stripped during tokenization.
If the input is a **single character**, it is embedded as-is:

```js
emlet.embed('.')
emlet.embed('[')
```

This allows punctuation-level modeling when needed without polluting normal text embeddings.

## API Surface

Emlet intentionally exposes a minimal API:

* `embed(text: string): number[]`
* `new Emlet(dim?: number, useTail?: boolean)`

Everything else—chunking, similarity, indexing, clustering—is left to userland.

## Examples

See [`test.js`](./test.js) for example usage including batch encoding, similarity math, and vector inspection.


## Testing

Emlet includes a test suite built with [testr](https://npmjs.com/package/@basd/testr).

To run the test, first clone the repository:

```sh
git clone https://github.com/basedwon/emlet.git
```

Install the dependencies, then run `npm test`:

```bash
npm install
npm test
```

## Donations

If Emlet sparks something useful in your work, consider sending some coin to support further development.

**Bitcoin (BTC):**
```
1JUb1yNFH6wjGekRUW6Dfgyg4J4h6wKKdF
```

**Monero (XMR):**
```
46uV2fMZT3EWkBrGUgszJCcbqFqEvqrB4bZBJwsbx7yA8e2WBakXzJSUK8aqT4GoqERzbg4oKT2SiPeCgjzVH6VpSQ5y7KQ
```

## License

**Emlet License v1.0 (based on Apache 2.0)**
Use is permitted with attribution. Redistribution, rebranding, resale, and reverse engineering are prohibited without written permission.

See [`LICENSE`](./LICENSE) for full terms.
Contact: `basedwon@tuta.com` for commercial or licensing inquiries.

