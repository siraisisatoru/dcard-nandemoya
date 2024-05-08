import React, { useState } from "react";
const QuestionCard = ({ cardId, questionConfig, hide, previousCB, nextCB }) => {
    const [ans, setAns] = useState(0);

    return (
        <div
            id={`q-${cardId}`}
            key={cardId}
            className={`hero relative w-96 min-h-[400px] rounded-3xl overflow-hidden shadow-xl shadow-gray-300 bg-white ${
                hide ? "hidden" : ""
            }`}>
            {/* Load background image based on json config */}
            <img
                src={questionConfig.imgUrl}
                alt="Question background image"
                className="absolute w-full opacity-40"
            />
            {/* Card Content */}
            <div className="hero-content text-center !w-full !h-full">
                <div className=" prose p-4 bg-white/70 rounded-xl w-full h-full flex flex-col">
                    <h1 className="mb-5 ">Question {cardId}</h1>
                    <p className="mb-5">{questionConfig.question}</p>
                    <div className="mx-4">
                        {/* Simple switch to detect type of questions */}
                        {questionConfig.type === "MC" ? (
                            // A drop down were used for rating. Can change to other type of inputs
                            <>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    onChange={(e) => {
                                        setAns(e.target.selectedIndex);
                                    }}>
                                    {questionConfig.options.map((op, idx) => {
                                        return <option key={idx}>{op}</option>;
                                    })}
                                </select>
                            </>
                        ) : questionConfig.type === "rating" ? (
                            // A slider were used for rating. Can change to other type of inputs
                            <>
                                <input
                                    type="range"
                                    min={0}
                                    max="100"
                                    defaultValue={0}
                                    className="range"
                                    step="25"
                                    onChange={(e) => {
                                        setAns(e.target.value / 25);
                                    }}
                                />
                                <div className="w-full flex justify-between text-xs px-2">
                                    <span>|</span>
                                    <span>|</span>
                                    <span>|</span>
                                    <span>|</span>
                                    <span>|</span>
                                </div>
                            </>
                        ) : questionConfig.type === "slide" ? (
                            // if new types of input needed, use this as template and apply 'onChange' callback to update answer state
                            <>
                                {/* <input type="range" min={0} max="100" defaultValue={0} className="range" /> */}
                            </>
                        ) : null}
                    </div>

                    {/* Card navigation buttons */}
                    <div className="grid grid-cols-2 mt-auto gap-24">
                        <button
                            className={`btn shadow-md shadow-slate-400 ${
                                cardId > 1 ? "" : "hidden"
                            }`}
                            onClick={(e) => previousCB(cardId, ans)}>
                            Previous
                        </button>
                        <button
                            className="btn shadow-md shadow-slate-400 col-start-2"
                            onClick={(e) => nextCB(cardId, ans)}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
