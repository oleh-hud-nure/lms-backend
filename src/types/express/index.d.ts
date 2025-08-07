export { }

declare global {
    namespace Express {
        export interface Request {
            userEmail?: string,
            userId?: string
        }
    }
}
