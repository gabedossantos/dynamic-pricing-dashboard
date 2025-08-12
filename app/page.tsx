import { redirect } from "next/navigation";

export default function Home() {
  // Immediately send users to the full simulator experience
  redirect("/demo/dynamic-pricing");
  // Fallback (should never render) – keeps type checker happy
  return null;
}
