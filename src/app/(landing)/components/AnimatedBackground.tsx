// "use client";

// import { motion } from "framer-motion";

// export default function AnimatedBackground() {
//   return (
//     <>
//       {[...Array(3)].map((_, index) => (
//         <motion.div
//           key={index}
//           className="absolute inset-0 opacity-20 dark:opacity-10"
//           style={{
//             background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
//           }}
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.1, 0.2, 0.1],
//             x: [
//               `${-20 + index * 10}%`,
//               `${20 - index * 10}%`,
//               `${-20 + index * 10}%`,
//             ],
//             y: [
//               `${-20 + index * 10}%`,
//               `${20 - index * 10}%`,
//               `${-20 + index * 10}%`,
//             ],
//           }}
//           transition={{
//             duration: 12 + index * 2,
//             repeat: Infinity,
//             ease: "easeInOut",
//             times: [0, 0.5, 1],
//           }}
//         />
//       ))}
//     </>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      />
    );
  }

  return (
    <>
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [
              `${-20 + index * 10}%`,
              `${20 - index * 10}%`,
              `${-20 + index * 10}%`,
            ],
            y: [
              `${-20 + index * 10}%`,
              `${20 - index * 10}%`,
              `${-20 + index * 10}%`,
            ],
          }}
          transition={{
            duration: 12 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </>
  );
}
