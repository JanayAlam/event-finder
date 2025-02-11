import Image from "next/image";
import Link from "next/link";
import PageNotFoundImage from "/public/images/page-not-found-page.svg";

const NotFound = () => {
  return (
    <div>
      <div className="grid h-screen place-content-center bg-white">
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

          <div className="mt-4">
            <Link href={"/"}>
              <button className="px-4 py-2 rounded-md border hover:border-green-600 border-green-200 bg-green-200">
                Return to home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
