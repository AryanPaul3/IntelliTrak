import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div
      className='min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black flex items-center justify-center relative overflow-hidden p-4'
    >

      <Outlet /> {/* This is where the nested route component (e.g., LoginPage) will be rendered */}
    </div>
  );
}