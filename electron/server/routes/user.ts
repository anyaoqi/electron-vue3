import type { Request, Response } from "express"
// import Log from "../databases/Log"
// import * as Log from "../databases/Log"
const express = require("express")
const router = express.Router()

/* GET users listing. */
router.get("/", async (req: Request, res: Response) => {
  // const log = await Log.findByPk(req.query?.id || 12)
  res.send('123')
})

export default router
