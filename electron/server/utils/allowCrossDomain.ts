import type { NextFunction, Request, Response } from "express"
// 跨域处理
const allowCrossDomain = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  )
  if (req.method === "OPTIONS") res.status(200).send()
  else next()
}
export default allowCrossDomain
