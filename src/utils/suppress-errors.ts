/* eslint-disable no-console */

// Suppress console errors for handled errors in development
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;

  console.error = function (...args: any[]) {
    const firstArg = args[0];

    // Suppress AxiosError for rate limiting (429) - these are handled
    if (
      firstArg instanceof Error &&
      firstArg.message &&
      firstArg.message.includes("too quickly")
    ) {
      return;
    }

    // Suppress handled errors marked with isHandled flag
    if (
      typeof firstArg === "object" &&
      firstArg !== null &&
      (firstArg as any).isHandled === true
    ) {
      return;
    }

    // Call the original console.error for other errors
    originalConsoleError.apply(console, args);
  };
}
