// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';

const WORD_LENGTH = 5;

export default function Line({
    guess,
    solution,
    isFinal,
    isShaking,
    setIsShaking,
}) {
    const tiles = [];

    const shakeAnimation = {
        x: isShaking ? [-1, 2, -1] : null,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
            repeat: 1,
        },
    };

    for (let i = 0; i < WORD_LENGTH; i++) {
        const char = guess[i];
        let className = 'tile';

        if (isFinal) {
            if (char === solution[i]) {
                className += ' correct';
            } else if (solution.includes(char)) {
                className += ' wrongplace';
            } else {
                className += ' incorrect';
            }
        }

        tiles.push(
            <motion.div
                key={i}
                className={className}
                animate={shakeAnimation}
                onAnimationComplete={() => setIsShaking(false)}
            >
                {char}
            </motion.div>
        );
    }

    return <div className="line">{tiles}</div>;
}
