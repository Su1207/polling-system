import { useEffect, useState } from "react";
import Intervue from "~/components/Intervue";
import TimerDropDown from "~/components/TimerDropDown";
import { connectSocket } from "~/utils/socket";
import { useNavigate } from "react-router";
import { loadUserFromSession } from "~/lib/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "~/lib/store";
import { setCurrentPoll } from "~/lib/pollSlice";

interface OptionProp {
  option: string;
  isCorrect: boolean;
}

const socket = connectSocket();

const createPoll = () => {
  const [options, setOptions] = useState<OptionProp[]>([
    { option: "", isCorrect: false },
    { option: "", isCorrect: false },
  ]);

  const [question, setQuestion] = useState<string>("");
  const [timer, setTimer] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const role = useSelector((state: RootState) => state.user.role);

  const handleTimerChange = (seconds: number) => {
    setTimer(seconds);
  };

  const validateForm = () => {
    if (question.trim() === "") {
      alert("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      alert("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.option.trim());
    if (optionTexts.some((text) => text === "")) {
      alert("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.isCorrect === true
    );
    if (!correctOptionExists) {
      alert("At least one correct option must be selected");
      return false;
    }

    return true;
  };

  //   const handleViewPollHistory = () => {
  //     navigate("/teacher-poll-history");
  //   };

  const handleOptionChange = (
    index: number,
    field: "option" | "isCorrect",
    value: string | boolean
  ) => {
    const newOptions = [...options];
    if (field === "option") {
      newOptions[index].option = value as string;
    } else {
      newOptions[index].isCorrect = value as boolean;
    }
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { option: "", isCorrect: false }]);
  };

  useEffect(() => {
    dispatch(loadUserFromSession());
  }, [dispatch]);

  const handleSubmit = () => {
    if (validateForm()) {
      if (!role || role === "student") {
        alert("Please login as teacher to create poll");
        navigate("/");
        return;
      }
      let pollData = { question, options, timer };
      socket.emit("createPoll", pollData);
      navigate("/teacherPoll");
      console.log("Submit Data:", pollData);
      setQuestion("");
      setOptions([
        { option: "", isCorrect: false },
        { option: "", isCorrect: false },
      ]);
      setTimer(null);
    }
  };

  useEffect(() => {
    socket.on("pollError", (data: any) => {
      console.log(`Error creating poll: ${data.message}`);
    });

    return () => {
      socket.off("pollError");
    };
  }, [navigate]);

  return (
    <div className="w-4xl p-8 mt-4 mx-4 flex flex-col gap-8 items-left">
      <Intervue />

      <div className="space-y-2">
        <h1 className="text-4xl">
          Let's <span className="font-semibold">Get Started</span>
        </h1>
        <p className="text-[#00000080]">
          you’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>
      </div>

      <div className=" space-y-2">
        <div className=" flex items-center justify-between gap-4">
          <h3 className="font-semibold">Enter your question</h3>
          <TimerDropDown time={timer} onChange={handleTimerChange} />
        </div>
        <textarea
          name="question"
          id="question"
          placeholder="Enter your question?"
          value={question}
          required
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-[#F1F1F1] rounded p-4 resize-none outline-none text-sm"
          rows={5}
        ></textarea>
      </div>

      <div className="space-y-4">
        <div className="font-semibold flex items-center">
          <h3 className="flex-2/3">Edit Options</h3>
          <h3 className="flex-1/3">Is it correct?</h3>
        </div>

        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-[#8F64E1] to-[#4E377B] text-white text-sm font-bold">
              {index + 1}
            </div>

            <input
              type="text"
              value={option.option}
              required
              onChange={(e) =>
                handleOptionChange(index, "option", e.target.value)
              }
              placeholder={`Option ${index + 1}`}
              className=" min-w-[500px] bg-[#F1F1F1] border-none outline-none text-sm border rounded px-3 py-3"
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect}
                  onChange={() => handleOptionChange(index, "isCorrect", true)}
                  className="accent-purple-600"
                />
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={!option.isCorrect}
                  onChange={() => handleOptionChange(index, "isCorrect", false)}
                  className="accent-purple-600"
                />
                No
              </label>
            </div>
          </div>
        ))}

        <button onClick={addOption} className="text-purple-600 font-semibold">
          + Add More option
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r w-fit from-[#8F64E1] to-[#1D68BD] px-8 py-2 cursor-pointer rounded text-white font-semibold"
      >
        Submit
      </button>
    </div>
  );
};

export default createPoll;
