# Emlet

> **A compact embedding engine built for the web.**

[![npm](https://img.shields.io/npm/v/emlet?style=flat&logo=npm)](https://www.npmjs.com/package/emlet)
[![pipeline](https://gitlab.com/basedwon/emlet/badges/master/pipeline.svg)](https://gitlab.com/basedwon/emlet/-/pipelines)
[![license](https://img.shields.io/npm/l/emlet)](https://gitlab.com/basedwon/emlet/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/emlet)](https://www.npmjs.com/package/emlet) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/basedwon/emlet)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/emlet)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

Emlet is a fast, fully self-contained semantic embedding model designed to run anywhere JavaScript runs—browser, Node, edge, offline. No dependencies, no GPU, no network calls. Just load it and embed.

The entire engine fits in ~1 MB and produces deterministic vector embeddings suitable for similarity search, clustering, retrieval, tagging, or downstream ML workflows.

## Features

* In-browser semantic embeddings
* Deterministic output (same input → same vector)
* Offline-first, zero runtime dependencies
* Unicode-aware: text, symbols, emoji, ZWJ sequences
* Out-of-vocabulary synthesis (no missing tokens)
* Configurable vector dimensionality
* Optional “glimpse” tail of the full 1536D space

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

Both styles are supported from the same file.

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
const model = new Emlet(128)       // 128D output
const model2 = new Emlet(64, true) // 64D head + 32D tail = 96D
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

## Common Patterns

### Text Chunking

```js
function chunkText(text, maxLen = 80) {
  const words = text.split(/\s+/)
  const chunks = []
  let chunk = ''

  for (let word of words) {
    if ((chunk + ' ' + word).trim().length > maxLen) {
      chunks.push(chunk.trim())
      chunk = word
    } else {
      chunk += ' ' + word
    }
  }

  if (chunk) chunks.push(chunk.trim())
  return chunks
}
```

### Cosine Similarity

```js
function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return dot / (normA * normB + 1e-8)
}
```

### Top-K Similarity Search

```js
function topKSimilar(input, options, k = 5) {
  const base = emlet.embed(input)
  return options
    .map(text => ({
      text,
      score: cosineSim(base, emlet.embed(text))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}
```

## API Surface

Emlet intentionally exposes a minimal API:

* `embed(text: string): number[]`
* `new Emlet(dim?: number, useTail?: boolean)`

Everything else—chunking, similarity, indexing, clustering—is left to userland.

## Testing

Emlet includes a test suite built with [testr](https://npmjs.com/package/@basd/testr).

To run the test, first clone the respository:

```sh
git clone https://github.com/basedwon/emlet.git
```

Install the (dev) dependencies, then run `npm test`:

```bash
npm install
npm test
```

## Donations

If you find this project useful and want to help support further development, please send us some coin. We greatly appreciate any and all contributions. Thank you!

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

