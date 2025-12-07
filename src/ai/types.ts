export type ErrorCall = (error: Error) => void

export type Job = () => Promise<void>
