import { Request, Response } from "express";

type AsyncMethod = (req: Request, res: Response) => Promise<void>;
type MethodList = { [name: string]: AsyncMethod };

export class BaseController {
  methods: MethodList = {};

  constructor(methods: MethodList) {
    this.methods = methods;
  }

  call(name: string) {
    if (name in this.methods) {
      return this.methods[name];
    }
    throw new Error(`Method ${name} not found.`);
  }
}
