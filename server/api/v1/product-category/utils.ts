import { getFormattedCurrentDateTime } from "../../../services/date";
import {
  PRODUCT_CATEGORY_BANNER_PHOTO_UPLOAD_FOLDER_NAME,
  PRODUCT_CATEGORY_COVER_PHOTO_UPLOAD_FOLDER_NAME,
  PRODUCT_CATEGORY_ICON_UPLOAD_FOLDER_NAME
} from "../../../settings/constants";

export const getBannerPhotoKey = (categoryTitle: string) => {
  return `${PRODUCT_CATEGORY_BANNER_PHOTO_UPLOAD_FOLDER_NAME}/${categoryTitle?.replace(
    " ",
    "_"
  )}-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;
};

export const getCoverPhotoKey = (categoryTitle: string) => {
  return `${PRODUCT_CATEGORY_COVER_PHOTO_UPLOAD_FOLDER_NAME}/${categoryTitle?.replace(
    " ",
    "_"
  )}-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;
};

export const getIconKey = (categoryTitle: string) => {
  return `${PRODUCT_CATEGORY_ICON_UPLOAD_FOLDER_NAME}/${categoryTitle.replace(
    " ",
    "_"
  )}-${getFormattedCurrentDateTime("DDMMYYYYHHmmss")}.jpg`;
};
