import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = err.message || "Something went wrong!";

  if (err instanceof ZodError) {
    message = err.issues[0].message;
  } else if (err.name === "TokenExpiredError") {
    message = "Unauthorized Access!";
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    errorDetails: err,
  });
};

export default globalErrorHandler;
