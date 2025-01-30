import Image from "next/image";
import PageNotFoundImage from "/public/images/page-not-found-page.svg";

const NotFound = () => {
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <Image
          className="mx-auto h-56 w-auto text-black sm:h-64"
          src={PageNotFoundImage}
          alt={"Page not found image"}
        />

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </h1>

        <p className="mt-4 text-gray-500">We can't find that page.</p>
      </div>
    </div>
  );
};

export default NotFound;
