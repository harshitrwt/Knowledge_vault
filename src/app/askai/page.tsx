import { Suspense } from "react";
import AskAiClient from "./askAiClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AskAiClient />
    </Suspense>
  );
}
