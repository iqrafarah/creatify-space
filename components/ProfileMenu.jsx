import Link from "next/link";

export default function ProfileMenu() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "GET" });
      window.location.href = "/login";
    } catch (error) {
      window.location.href = "/login";
    }
  };


  return (
    <div className="absolute right-0 top-full mt-2 w-full sm:w-60 dropDownProfile">
      <div className="flex flex-col px-1 py-2">
        <ul className="flex flex-col cursor-default text-sm">
          <div className="p-2">
            <p className="font-semibold text-sm">My account</p>
          </div>
          <div className="border-t border-[#f1f5f9] my-1"></div>
          <Link href="/dashboard">
            <li className="hover:bg-[#f1f5f9] px-2 py-1.5 rounded-md">
              Dashboard
            </li>
          </Link>
          {/* <Link href="/settings">
            <li className="hover:bg-[#f1f5f9] px-2 py-1.5 rounded-md">
              Settings
            </li>
          </Link> */}
          <div className="border-t border-[#f1f5f9] my-1"></div>
          <li
            className="hover:bg-[#f1f5f9] px-2 py-1.5 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
