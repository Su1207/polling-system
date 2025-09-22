import { connect } from "http2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { setCurrentPoll, setVotes } from "~/lib/pollSlice";
import type { AppDispatch, RootState } from "~/lib/store";
import { connectSocket } from "~/utils/socket";
import type { PollDataProp } from "./submitAnswer";

const socket = connectSocket();

const teacherPoll = () => {
  const [pollData, setPollData] = useState<PollDataProp | null>(null);
  const [votes, setVotes] = useState<{ [key: number]: number }>({});

  const totalVotes = Object.values(votes).reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );

  useEffect(() => {
    socket.on("pollCreated", (poll) => {
      setPollData(poll);
    });

    socket.on("pollClosed", (data: any) => {
      console.log("Poll closed:", data);
      alert("The poll has been closed.");
    });

    socket.on("pollResults", (data: any) => {
      console.log(data);
      setVotes(data);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollClosed");
      socket.off("pollResults");
    };
  }, []);

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
        <h3 className="font-semibold text-2xl">Question</h3>

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
                      option.isCorrect
                        ? "border-[#8F64E1] font-semibold"
                        : "border-[#8D8D8D30] bg-[#F1F1F1]"
                    } cursor-not-allowed`}
                  >
                    <div className="relative flex items-center gap-3 px-4 py-3 transition-all duration-300 ease-in-out rounded overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#6766D5] rounded transition-all duration-500"
                        style={{
                          width: `${calculatePercentage(votes[index])}%`,
                        }}
                      ></div>

                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold relative z-10 bg-white text-[#6766D5]`}
                      >
                        {index + 1}
                      </div>

                      <p className="flex-1 relative z-10">{option.option}</p>

                      <span className="font-semibold relative z-10">
                        {Math.round(calculatePercentage(votes[index] || 0))}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Link
            to={"/teacher"}
            className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] px-16 py-4 cursor-pointer rounded-4xl text-white text-lg font-semibold"
          >
            + Ask a new question
          </Link>
        </div>
      </div>
    </div>
  );
};

export default teacherPoll;
