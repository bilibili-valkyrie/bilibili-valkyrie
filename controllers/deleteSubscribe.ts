import { Response } from "express";
import Uper from "../models/Uper";
import Video from "../models/Video";

const deleteSubscribe = async (
  id: string,
  res: Response<any, Record<string, any>>
): Promise<void> => {
  const uper = await Uper.findByIdAndDelete(id);
  if (uper === null) return res.status(204).end();
  await Video.deleteMany({ uper: uper._id });
};

export default deleteSubscribe;
