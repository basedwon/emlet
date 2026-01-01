// emlet.test.js

const { emlet, Emlet } = require('./emlet')

describe('Emlet', () => {
  it('should return a vector for basic text', () => {
    const vec = emlet.embed('hello world')
    expect(vec).to.be.an('array')
    expect(vec.length).to.equal(96)
    expect(vec.every(v => typeof v === 'number')).to.be.true
  })
  
  it('should support custom dimensions', () => {
    const model = new Emlet(128)
    const vec = model.embed('test')
    expect(vec.length).to.equal(128)
  })
  
  it('should synthesize OOV words', () => {
    const vec = emlet.embed('quantaflux')
    expect(vec.length).to.equal(96)
  })

  it('should embed emojis and ZWJ sequences', () => {
    const vec1 = emlet.embed('🦄')
    const vec2 = emlet.embed('👩🏽‍🚀')
    expect(vec1.length).to.equal(96)
    expect(vec2.length).to.equal(96)
  })

  it('should embed punctuation as standalone', () => {
    const vec = emlet.embed('.')
    expect(vec.length).to.equal(96)
  })

  it('should chunk long text and embed each chunk', () => {
    const chunks = chunkText(
      'This is a long passage that needs to be split into smaller pieces for individual embedding.',
      30
    )
    expect(chunks.length).to.be.above(1)
    const vecs = chunks.map(c => emlet.embed(c))
    expect(vecs.every(v => v.length === 96)).to.be.true
  })

  it('should find top K similar phrases using cosine similarity', () => {
    const phrases = [
      'the sun rises in the east',
      'a cat sits on the mat',
      'early morning light',
      'sunshine over the hills',
      'darkness before dawn'
    ]
    const input = 'morning sunlight'
    const top = topKSimilar(input, phrases, 3)
    expect(top.length).to.equal(3)
    expect(top[0].score).to.be.above(top[2].score)
  })
})

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

function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return dot / (normA * normB + 1e-8)
}

function topKSimilar(input, options, k = 5) {
  const base = emlet.embed(input)
  return options
    .map(text => {
      const vec = emlet.embed(text)
      return { text, score: cosineSim(base, vec) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}
