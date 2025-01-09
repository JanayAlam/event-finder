import { z } from "zod";
import { PhotoUploadSchema } from "../../types/services";

export type TPhotoUploadParam = z.infer<typeof PhotoUploadSchema>;
