import { useState } from "react";
import type { Route } from "./+types/home";
import Intervue from "~/components/Intervue";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "~/lib/store";
import { setUser } from "~/lib/userSlice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Polling System App" },
    { name: "description", content: "Welcome to Polling System!" },
  ];
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "teacher") {
      dispatch(setUser({ username: "teacher", role: "teacher" }));
      navigation("/teacher");
    } else if (selectedRole === "student") {
      navigation("/student");
    } else {
      alert("Please select a role to continue.");
    }
  };

  return (
    <main className="mx-auto py-8 px-4 flex min-h-screen items-center justify-center">
      <section className="flex flex-col items-center gap-8">
        <Intervue />

        <div className="text-center space-y-2">
          <h1 className="text-4xl">
            Welcome to the{" "}
            <span className="font-semibold">Live Polling System</span>
          </h1>
          <p className="text-[#00000080]">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 max-w-xl w-full">
          <div
            className={`border-3 rounded-[10px] p-5 text-left transition-all duration-300 ease-in-out ${selectedRole === "student" ? "border-[#7765DA]" : "border-[#D9D9D9]"}`}
            onClick={() => setSelectedRole("student")}
          >
            <h2 className="font-semibold">I'm a Student</h2>
            <p className="text-[#454545] text-sm mt-2">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
          <div
            className={`border-3 rounded-[10px] p-5 text-left transition-all duration-300 ease-in-out ${selectedRole === "teacher" ? "border-[#7765DA]" : "border-[#D9D9D9]"}`}
            onClick={() => setSelectedRole("teacher")}
          >
            <h2 className="font-semibold">I'm a Teacher</h2>
            <p className="text-[#454545] text-sm mt-2">
              Create and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] px-16 py-4 cursor-pointer rounded-4xl text-white font-semibold"
        >
          Continue
        </button>
      </section>
    </main>
  );
}
