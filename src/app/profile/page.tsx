"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoArrowUndo, IoCreateOutline } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "../components/UserMenu";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট হয়েছে।");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        },
      },
    });
  };

  if (isPending || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-[920px] space-y-4 sm:space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[920px]">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          আমার প্রোফাইল
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-base-100 p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <UserAvatar name={user.name} image={user.image} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
                {user.name}
              </p>
              <p className="truncate text-sm text-gray-600 sm:text-base">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/profile/updateProfile"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#05893E] px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-green-800 sm:w-auto"
            >
              <IoCreateOutline />
              তথ্য হালনাগাদ করুন
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500 bg-white px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50 sm:w-auto"
            >
              <IoArrowUndo />
              সাইন আউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;