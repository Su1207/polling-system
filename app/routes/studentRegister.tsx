import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Intervue from "~/components/Intervue";
import type { AppDispatch } from "~/lib/store";
import { setUser } from "~/lib/userSlice";

const studentRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("Please enter your name");
      return;
    }
    dispatch(setUser({ username: name, role: "student" }));
    navigate("/submitAnswer");
  };

  return (
    <div className="mx-auto w-full py-8 px-4 flex min-h-screen items-center justify-center">
      <section className="flex flex-col items-center gap-8">
        <Intervue />

        <div className="text-center space-y-2">
          <h1 className="text-4xl">
            Let's <span className="font-semibold">Get Started</span>
          </h1>
          <p className="text-[#00000080] max-w-3xl">
            If you’re a student, you’ll be able to submit your answers,
            participate in live polls, and see how your responses compare with
            your classmates
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[18px]">Enter your Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[90vw] md:w-lg bg-[#F1F1F1] rounded p-3 mt-2 outline-none text-sm text-[#000000]"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] px-16 py-4 cursor-pointer rounded-4xl text-white font-semibold"
        >
          Continue
        </button>
      </section>
    </div>
  );
};

export default studentRegister;
