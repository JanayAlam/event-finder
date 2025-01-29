import { getFormattedCurrentDateTime } from "../../../services/date";
import { PRODUCT_BASE_PHOTO_FOLDER_NAME } from "../../../settings/constants";

export const generateProductPhotoKey = (
  outletId: string,
  productName: string
): string => {
  return `${PRODUCT_BASE_PHOTO_FOLDER_NAME}/${outletId}/${productName.replace(" ", "_").replace(".", "")}-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;
};
