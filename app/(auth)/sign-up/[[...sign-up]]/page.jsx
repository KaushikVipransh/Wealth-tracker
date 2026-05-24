import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex justify-center">
        {/* 📝 Clerk's native drop-in registration form component */}
        <SignUp />
      </div>
    </div>
  );
}