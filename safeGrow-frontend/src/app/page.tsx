import Homepage from "../components/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage | SafeGrow",
};

export default function Home() {
  return (
    <Homepage />
  );
}
