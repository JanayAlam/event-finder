import Navbar from "@/components/ui/navbar";
import { PAGE_WIDTH_CLASS_NAME } from "@/constants";
import { cn } from "@/utils/tailwind-utils";

export default function MainAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center py-4">
        <div className={cn(PAGE_WIDTH_CLASS_NAME)}>{children}</div>
      </div>
    </>
  );
}
