"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoArrowUndo } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "../components/UserMenu";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

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

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = name.trim();

    if (!newName) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }
    if (newName === session?.user?.name) {
      toast("নামে কোনো পরিবর্তন নেই।");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({ name: newName });
    setSaving(false);

    if (error) {
      console.log("UPDATE NAME ERROR:", error);
      toast.error("নাম পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("নাম সফলভাবে পরিবর্তন হয়েছে।");
    router.refresh();
  };

  if (isPending || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-[920px] space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-[920px]">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          আমার প্রোফাইল
        </h1>
        <p className="mt-1 text-gray-600">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-base-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} image={user.image} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-gray-600">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-500 bg-white px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
          >
            <IoArrowUndo />
            সাইন আউট
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-base-100 p-6">
          <h2 className="text-xl font-bold text-gray-900">
            নাম হালনাগাদ করুন
          </h2>

          <form onSubmit={handleUpdate} className="mt-4">
            <label
              htmlFor="name"
              className="mb-1 block text-base font-medium text-gray-900"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="আপনার নাম লিখুন"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-4 rounded-lg bg-[#05893E] px-5 py-2.5 text-base font-semibold text-white shadow-md transition hover:bg-green-800 disabled:opacity-60"
            >
              {saving ? "অপেক্ষা করুন..." : "নাম হালনাগাদ করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;