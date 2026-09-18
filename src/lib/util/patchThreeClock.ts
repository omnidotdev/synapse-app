/**
 * Suppresses the THREE.Clock deprecation warning from Three.js r183+.
 * R3f 9.x internally instantiates THREE.Clock in its store, triggering
 * the console warning. Since there is no way to configure r3f to use
 * THREE.Timer yet, we use Three's setConsoleFunction API to filter out
 * the specific Clock deprecation message while forwarding all others.
 *
 * Import this module (side-effect) before any @react-three/fiber Canvas
 * mounts. Once r3f ships native Timer support, remove this file and its
 * import.
 */
import { getConsoleFunction, setConsoleFunction } from "three";

const SUPPRESSED = "Clock: This module has been deprecated.";

const previous = getConsoleFunction();

setConsoleFunction(
  (type: "log" | "warn" | "error", message: string, ...rest: unknown[]) => {
    // Swallow only the Clock deprecation warning
    if (
      type === "warn" &&
      typeof message === "string" &&
      message.includes(SUPPRESSED)
    ) {
      return;
    }

    // Forward everything else to the previous handler or native console
    if (previous) {
      previous(type, message, ...rest);
    } else {
      // biome-ignore lint/suspicious/noConsole: forwarding three.js internal logging to native console
      console[type](message, ...rest);
    }
  },
);
