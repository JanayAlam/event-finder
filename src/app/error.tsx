"use client";

interface IProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: IProps) {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-xl flex flex-col gap-4 text-center">
          <h1 className="font-extrabold  text-red-500 text-5xl">
            Uhh! Error Occurred!!!
          </h1>
          <p className="mt-5">{error.message}</p>
          <button
            className="mt-5 px-4 py-2 rounded-md border text-primary bg-brand-primary-main"
            onClick={reset}
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
