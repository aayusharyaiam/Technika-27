import { SignupExperience } from "@/components/signup-experience";
import { createPrivateMetadata } from "@/lib/seo";

export const metadata = createPrivateMetadata(
  "Sign In — Return to the Common Room",
  "Sign in to your Technika 2K26 account and return to your common room.",
  "/login"
);

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const callbackError =
    error === "reset" || error === "confirmation" ? error : undefined;

  return (
    <SignupExperience
      initialMode="login"
      callbackError={callbackError}
    />
  );
}
