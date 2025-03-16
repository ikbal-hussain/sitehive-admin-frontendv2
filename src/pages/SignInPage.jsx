import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center m-5">
      <SignIn />
    </div>
  );
}

export default SignInPage;
