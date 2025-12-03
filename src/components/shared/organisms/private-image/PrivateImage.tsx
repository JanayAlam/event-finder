/* eslint-disable jsx-a11y/alt-text */
"use client";

import Image, { ImageProps } from "next/image";

type TPrivateImageProps = Omit<ImageProps, "src"> & {
  filePath?: string;
  apiRoute?: string;
};

export default function PrivateImage({
  filePath = "",
  apiRoute = "/api/files",
  ...rest
}: TPrivateImageProps) {
  if (!filePath) {
    return null;
  }

  const src = `${apiRoute}?filePath=${encodeURIComponent(filePath)}`;

  return <Image unoptimized src={src} {...rest} />;
}
