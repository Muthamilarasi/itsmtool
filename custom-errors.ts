export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export const CustomError = (code: string, message: string): Error => {
  const err: any = new Error(message);
  err.code = code;
  return err as Error;
};
