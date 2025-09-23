import React from "react";
import Intervue from "~/components/Intervue";

const kickout = () => {
  return (
    <main className="mx-auto py-8 px-4 flex min-h-screen items-center justify-center">
      <section className="flex flex-col items-center gap-8">
        <Intervue />

        <div className="text-center space-y-2">
          <h1 className="text-4xl">You've been kicked out !</h1>
          <p className="text-[#00000080] font-normal">
            Looks like the teacher had removed you from the poll system .Please
            Try again sometime.
          </p>
        </div>
      </section>
    </main>
  );
};

export default kickout;
