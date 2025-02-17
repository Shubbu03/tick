import { Rocket } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center">
        <Rocket
          size={64}
          className="text-teal-700 dark:text-teal-600 mx-auto mb-6 animate-bounce"
        />
        <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-600 mb-2 transition-colors duration-300">
          Coming Soon
        </h1>
        <p className="text-teal-700 dark:text-teal-600 text-lg transition-colors duration-300">
          We`re working on something awesome!
        </p>
      </div>
    </div>
  );
}
