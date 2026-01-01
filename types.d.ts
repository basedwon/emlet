// types.d.ts

declare class Emlet {
  constructor(dim?: number, useTail?: boolean)
  embed(text: string): number[]
}

declare const emlet: Emlet

export { emlet, Emlet }
export default emlet
