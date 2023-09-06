import type { Request } from "express";

export const filteredMatch = (req: Request, searchParam: string) => {
  if (!req.query.filter) return {};

  return { [searchParam]: RegExp(req.query.filter as string, "i") };
};

export const count = async (model: any, req: Request, arrayFiltered: any[]) => {
  if (!req.query.filter) {
    const count = await model.countDocuments();
    return count;
  }
  return arrayFiltered.length;
};
