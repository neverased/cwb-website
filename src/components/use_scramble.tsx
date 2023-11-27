import React, { useEffect, useState } from "react";
import { useScramble } from "use-scramble";

interface IntroProps {
    texts: string[][];
}

export const Intro = ({ texts }: IntroProps) => {
    const [index, setIndex] = useState(0);

    const { ref, replay } = useScramble({
        text: texts[index][0],
        tick: 3,
        speed: 0.5,
        step: 3,
        onAnimationEnd: () => {
            if (index < texts.length - 1) {
                setIndex(index + 1);
            } else {
                replay();
            }
        },
    });

    useEffect(() => {
        setIndex(0);
    }, [texts]);

    return (
        <div>
            <pre style={{ fontFamily: "monospace" }}>
                {texts.slice(0, index + 1).map((line, i) => (
                    <div
                        key={i}
                        ref={i === index ? ref : null}
                    >
                        {line.join(" ")}
                    </div>
                ))}
            </pre>
        </div>
    );
};
