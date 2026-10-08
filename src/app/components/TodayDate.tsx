import { connection } from "next/server";

const TodayDate = async ({
  className = "block text-xs text-gray-500",
}: {
  className?: string;
}) => {
  await connection();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
    timeZone: "Asia/Dhaka",
  });

  return <span className={className}>{date}</span>;
};

export default TodayDate;