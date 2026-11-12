"use client";

import { loader } from "@monaco-editor/react";
import { Banner, Button, LoadingOverlay } from "@payloadcms/ui";
import { type ReactNode, useEffect, useState } from "react";

let initialization: Promise<void> | undefined;

function prepareLocalEditor() {
  if (!initialization) {
    self.MonacoEnvironment = {
      // Payload bundles another loader; both discover this shared local API.
      globalAPI: true,
      getWorker(_moduleId, label) {
        switch (label) {
          case "json":
            return new Worker(
              new URL(
                "monaco-editor/languages/features/json/json.worker.js",
                import.meta.url,
              ),
              { type: "module" },
            );
          case "css":
          case "scss":
          case "less":
            return new Worker(
              new URL(
                "monaco-editor/languages/features/css/css.worker.js",
                import.meta.url,
              ),
              { type: "module" },
            );
          case "html":
          case "handlebars":
          case "razor":
            return new Worker(
              new URL(
                "monaco-editor/languages/features/html/html.worker.js",
                import.meta.url,
              ),
              { type: "module" },
            );
          case "typescript":
          case "javascript":
            return new Worker(
              new URL(
                "monaco-editor/languages/features/typescript/ts.worker.js",
                import.meta.url,
              ),
              { type: "module" },
            );
          default:
            return new Worker(
              new URL("monaco-editor/editor/editor.worker.js", import.meta.url),
              { type: "module" },
            );
        }
      },
    };

    initialization = import("monaco-editor").then((monaco) => {
      loader.config({ monaco });
    });
  }

  return initialization;
}

export function LocalEditorProvider({ children }: { children?: ReactNode }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let mounted = true;

    void prepareLocalEditor().then(
      () => {
        if (mounted) setState("ready");
      },
      () => {
        if (mounted) setState("error");
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  // Editors must not mount before the loader is configured: their effects would
  // otherwise fetch Monaco's default CDN build instead of our patched package.
  if (state === "loading") return <LoadingOverlay overlayType="fullscreen" />;

  if (state === "error") {
    return (
      <Banner type="error">
        <p>Unable to load the admin panel. Reload the page to try again.</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </Banner>
    );
  }

  return children;
}
