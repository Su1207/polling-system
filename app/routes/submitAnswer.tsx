import { useEffect, useRef, useState } from "react";
import ChatPopover from "~/components/ChatPopOver";
import Intervue from "~/components/Intervue";
import { type Option } from "~/lib/pollSlice";
import { connectSocket } from "~/utils/socket";

const socket = connectSocket();

export interface PollDataProp {
  _id: string;
  question: string;
  options: Option[];
  timer: number;
  status: "active";
}

const submitAnswer = () => {
  const [pollData, setPollData] = useState<PollDataProp | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [votes, setVotes] = useState<{ [key: number]: number }>({});

  const totalVotes = Object.values(votes).reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );

  useEffect(() => {
    socket.on("pollCreated", (poll) => {
      setSubmitted(false);
      setSelectedOption(null);
      setPollData(poll);
      setTimeLeft(poll.timer);
    });

    socket.on("pollClosed", (data: any) => {
      console.log("Poll closed:", data);
      //   setPollData(null);
    });

    socket.emit("joinRoom");

    socket.on("currentPoll", ({ poll, timeLeft }) => {
      if (poll) {
        setPollData(poll);
        setTimeLeft(timeLeft);
      }
    });

    socket.on("pollResults", (data: any) => {
      console.log(data);
      setVotes(data);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollClosed");
      socket.off("pollResults");
      socket.off("currentPoll");

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (selectedOption !== null && pollData) {
      setSubmitted(true);
      socket.emit("submitAnswer", selectedOption);
    }
  };

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev ?? 1) - 1);
      }, 1000);
    } else if (timeLeft && timeLeft === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (!submitted && selectedOption !== null) {
        handleSubmit();
      }
      setSubmitted(true);
      setTimeLeft(null);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  console.log(pollData);

  const calculatePercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return count === 0 ? 0 : (count / totalVotes) * 100;
  };

  if (!pollData) {
    return (
      <div className="mx-auto py-8 px-4 flex flex-col gap-8 min-h-screen items-center justify-center">
        <Intervue />

        <div role="status">
          <svg
            aria-hidden="true"
            className="w-12 h-12 text-gray-200 animate-spin dark:text-white fill-[#500ECE]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>

        <p className="text-2xl font-semibold text-center">
          Wait for the teacher to ask a new question..
        </p>

        <ChatPopover />
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-4 flex min-h-screen items-center justify-center">
      <div className="w-3xl">
        <div className="flex items-center gap-6 mb-4">
          <h3 className="font-semibold text-2xl">Question 1</h3>
          <div className="flex items-center gap-2">
            <img src="/timer.svg" alt="time" />
            <p className="text-[#CB1206] text-lg font-semibold ">
              00:{timeLeft?.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="border border-[#AF8FF1] rounded-lg">
          <div className="h-fit font-semibold text-lg p-4 mb-2 bg-gradient-to-r rounded-t-lg from-[#343434] to-[#6E6E6E] text-white">
            {pollData.question}
          </div>

          <div className="py-6 px-6 space-y-4">
            {pollData?.options?.length > 0 &&
              pollData.options.map((option, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`transition-all duration-300 ease-in-out rounded border outline-none text-sm ${
                      index === selectedOption
                        ? "border-[#8F64E1] font-semibold"
                        : "border-[#8D8D8D30] bg-[#F1F1F1]"
                    } ${submitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => {
                      if (!submitted && timeLeft && timeLeft > 0)
                        setSelectedOption(index);
                    }}
                  >
                    <div className="relative flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-in-out rounded overflow-hidden">
                      {submitted && (
                        <div
                          className="absolute top-0 left-0 h-full bg-[#6766D5] rounded transition-all duration-500"
                          style={{
                            width: `${calculatePercentage(votes[index])}%`,
                          }}
                        ></div>
                      )}

                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold relative z-10 ${
                          index === selectedOption && !submitted
                            ? "bg-gradient-to-r from-[#8F64E1] to-[#4E377B]"
                            : submitted
                              ? "bg-white"
                              : "bg-[#8D8D8D]"
                        } ${submitted ? "text-[#6766D5]" : "text-white"}`}
                      >
                        {index + 1}
                      </div>

                      <p className="flex-1 relative z-10">{option.option}</p>

                      {submitted && (
                        <span className="font-semibold relative z-10">
                          {Math.round(calculatePercentage(votes[index] || 0))}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {!submitted ? (
          <div className="flex justify-end mt-5">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] px-16 py-4 cursor-pointer rounded-4xl text-white text-lg font-semibold"
            >
              Submit
            </button>
          </div>
        ) : (
          <p className="text-2xl font-semibold mt-5 text-center animate-pulse">
            Wait for the teacher to ask a new question..
          </p>
        )}
        <ChatPopover />
      </div>
    </div>
  );
};

export default submitAnswer;
