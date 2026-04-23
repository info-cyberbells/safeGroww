import type { Metadata } from "next";
import LoginPage from "@/src/components/LoginPage";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return <LoginPage />;
}
