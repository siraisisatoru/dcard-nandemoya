import { useState, useEffect } from "react";
import "./App.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import questionList from "./assets/questionList.json";
import imageBankList from "./assets/componentList.json";
import QuestionCard from "./components/QuestionCard";

/**
 * image source:
 * icon.png:      https://www.flaticon.com/free-icon/art_4893176
 * base.png:      https://opengameart.org/content/paperdoll-characters-template
 * Hessian*.png:  https://opengameart.org/content/hessian-uniform
 * knife.png:     https://opengameart.org/content/cc0-sword-icons
 * sward.png:     https://opengameart.org/content/cc0-sword-icons
 */

/**
 * Main p5 sketch
 */

function sketch(p5) {
    // Manager object for all parts
    let allPartsManager;

    // Input parameters
    let ansList;
    let goBack;

    // Flag to stop duplicate rendering. Reduce over source usage
    let running = true;

    // Class for each individual parts
    class Part {
        constructor(fileUrl, x, y, z_indx, zoom_lv) {
            this.fileUrl = fileUrl;
            this.x = x;
            this.y = y;
            this.z_indx = z_indx;
            this.zoom_lv = zoom_lv;
            this.img = p5.loadImage(fileUrl, () => {
                this.img.resize(this.img.width * this.zoom_lv, 0);
            });
        }

        show() {
            p5.image(this.img, this.x - this.img.width / 2, this.y - this.img.height / 2);
        }
    }

    // Class for ALL parts
    class Parts {
        constructor() {
            // this.parts follows the structure in the 'componentList.json'. Please use console.log to revide the structure.
            this.parts = this.convertToParts(imageBankList);
        }

        convertToParts(obj) {
            let partsObj = {};
            let partsArr = [];

            for (let key in obj) {
                if (typeof obj[key] === "object") {
                    if (!/^\d+$/.test(key)) {
                        partsObj[key] = this.convertToParts(obj[key]); // Recursively convert inner directories
                    } else {
                        const partDetails = obj[key];
                        const { fileUrl, x, y, z_indx, zoom_lv } = partDetails;
                        partsArr.push(new Part(fileUrl, x, y, z_indx, zoom_lv));
                    }
                }
            }

            if (partsArr.length) {
                return partsArr;
            } else {
                return partsObj;
            }
        }

        // Dedicated function to draw base image
        showBase() {
            this.parts.base[0].show();
        }

        renderLogic() {
            // TODO: implement your own logics on how to link the answers with the images
            /**
             * Given ansList as an array of numbers, the length will be the number of questions provided.
             */
        }

        // A sample rendering logic demostration
        renderTestLogic() {
            console.log(ansList);
            p5.tint(200, ansList[0] * 50, 0);
            this.parts.outer_main[0].show();
            p5.tint(200, ansList[1] * 50, 0);
            this.parts.inner_main.top[0].show();
            p5.tint(200, ansList[2] * 50, 0);
            this.parts.inner_main.bottom[1].show();
            p5.tint(200, ansList[3] * 50, 0);
            this.parts.inner_main.bottom[0].show();
            p5.tint(200, ansList[4] * 50, 0);
            this.parts.inner_main.middle[0].show();
            p5.noTint();
        }
    }

    // update input parameters
    p5.updateWithProps = (props) => {
        if (props.ansList) {
            ansList = props.ansList;
        }
        if (props.goBack) {
            goBack = props.goBack;
        }

        if (props.running) {
            running = true;
        }
    };

    // load images when entering the page
    p5.preload = () => {
        allPartsManager = new Parts();
    };

    // exit when press 'q' on keyboard or click in screen
    p5.keyPressed = () => {
        if (p5.key === "q") {
            running = false;
            goBack();
        }
        // Uncomment to prevent any default behavior.
        return false;
    };
    p5.touchStarted = () => {
        goBack();
    };

    // Setup function
    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background("pink");
        // p5.translate(p5.width / 2, p5.height / 2);
        // p5.scale(1, -1);
        // p5.scale(0.5);
        // console.log(imageBankList);
    };

    // Draw function (Main loop)
    p5.draw = () => {
        if (running) {
            p5.background("pink");
            p5.translate(p5.width / 2, p5.height / 2);

            p5.scale(0.5);
            allPartsManager.showBase();
            allPartsManager.renderLogic();
            allPartsManager.renderTestLogic();
            p5.scale(2);

            printReturnText();
            running = false;
        }
    };

    // Dynamic change window size
    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
        running = true;
    };

    const printReturnText = () => {
        p5.textAlign(p5.RIGHT);
        p5.noStroke();
        p5.textSize(22);
        p5.text("press 'q' return to questions", p5.width / 2 - 20, p5.height / 2 - 20);
    };
}

/**
 * Main react App
 */

function App() {
    // Variables
    const [showp5, setShowp5] = useState(false);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1); // This stores question number, begin from 1
    const [answerArr, setAnswerArr] = useState([]);
    // Convert questions into array
    var questionListArr = [];
    for (var i in questionList) questionListArr.push([i, questionList[i]]);

    // Call backs for question card ------------------------------
    const updateAnsArr = (cardId, ans) => {
        setAnswerArr((prevArr) => {
            console.log(prevArr);
            console.log(cardId - 1);

            prevArr[cardId - 1] = ans;
            return prevArr;
        });
    };
    const previousCB = (cardId, ans) => {
        updateAnsArr(cardId, ans);
        if (cardId > 1) {
            setCurrentQuestionNumber((prevIdx) => prevIdx - 1);
        }
    };
    const nextCB = (cardId, ans) => {
        updateAnsArr(cardId, ans);
        if (cardId < questionListArr.length) {
            setCurrentQuestionNumber((prevIdx) => prevIdx + 1);
        } else {
            setCurrentQuestionNumber(1);
            setShowp5(true);
        }
    };

    // Update card CSS for stack effect
    useEffect(() => {
        const elements = document.querySelectorAll(".stack > *:not(.hidden):nth-child(n)");
        elements.forEach((ele, idx) => {
            ele.style.transform = `translateY(${idx * 7 + "%"}) translateX(${
                idx * 5 + "%"
            }) scale(${1 - idx * 0.05})`;
            ele.style.zIndex = 3 - idx;
            ele.style.opacity = 1 - idx * 0.2;
        });
    }, [currentQuestionNumber, showp5]);

    // Main renderer
    return (
        <>
            {showp5 ? (
                <>
                    {/* P5 Canvas */}
                    <div className={`${!showp5 ? "hidden" : ""}`}>
                        <ReactP5Wrapper
                            sketch={sketch}
                            ansList={answerArr}
                            goBack={() => {
                                setShowp5(false);
                                setAnswerArr([]);
                            }}
                            running={true}
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Question card */}
                    <div className="flex w-screen h-screen">
                        <div className="stack m-auto ">
                            {questionListArr.map(([questionNumber, obj]) => {
                                return (
                                    <QuestionCard
                                        key={questionNumber}
                                        cardId={parseInt(questionNumber)}
                                        questionConfig={obj}
                                        previousCB={previousCB}
                                        nextCB={nextCB}
                                        hide={
                                            questionNumber > currentQuestionNumber + 2 ||
                                            questionNumber < currentQuestionNumber
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default App;
