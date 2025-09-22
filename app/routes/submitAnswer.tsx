import { useEffect, useRef, useState } from "react";
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [votes, setVotes] = useState<{ [key: number]: number }>({});

  const totalVotes = Object.values(votes).reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );

  useEffect(() => {
    socket.on("pollCreated", (poll) => {
      setPollData(poll);
      setTimeLeft(poll.timer);
    });

    socket.on("pollClosed", (data: any) => {
      console.log("Poll closed:", data);
      setPollData(null);
    });

    socket.on("pollResults", (data: any) => {
      console.log(data);
      setVotes(data);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollClosed");
      socket.off("pollResults");

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
    if (timeLeft > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (!submitted && selectedOption !== null) {
        handleSubmit();
        setSubmitted(true);
      }
      setPollData(null);
      setSelectedOption(null);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return count === 0 ? 0 : (count / totalVotes) * 100;
  };

  if (!pollData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto py-8 px-4 flex min-h-screen items-center justify-center">
      <div className="w-3xl">
        <div className="flex items-center gap-6 mb-4">
          <h3 className="font-semibold text-2xl">Question 1</h3>
          <div className="flex items-center gap-2">
            <img src="/timer.svg" alt="time" />
            <p className="text-[#CB1206] text-lg font-semibold ">
              00:{timeLeft.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="border border-[#AF8FF1] rounded-lg">
          <div className="h-fit font-semibold text-lg p-4 mb-2 bg-gradient-to-r rounded-t-lg from-[#343434] to-[#6E6E6E] text-white">
            {pollData.question}
          </div>

          <div className="py-6 px-6 space-y-4">
            {pollData?.options.length > 0 &&
              pollData.options.map((option, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`transition-all duration-300 ease-in-out rounded border outline-none text-sm ${
                      index === selectedOption
                        ? "border-[#8F64E1] font-semibold"
                        : "border-[#8D8D8D30] bg-[#F1F1F1]"
                    } ${submitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => {
                      if (!submitted && timeLeft > 0) setSelectedOption(index);
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
      </div>
    </div>
  );
};

export default submitAnswer;
