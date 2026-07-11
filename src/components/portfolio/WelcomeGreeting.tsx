import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETING_KEY = "portfolio_greeting_shown_session";

const WelcomeGreeting = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(GREETING_KEY)) return;

    const showTimer = window.setTimeout(() => {
      sessionStorage.setItem(GREETING_KEY, "1");
      setShow(true);
    }, 2000);

    const hideTimer = window.setTimeout(() => {
      setShow(false);
    }, 6000); // shown at 2s, hidden at 6s → visible for 4 seconds

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-max max-w-[92vw]">
      <AnimatePresence>
        {show && (
          <motion.div
            key="welcome-banner"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 12, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="px-5 py-2.5 rounded-full bg-card border border-white/80"
          >
            <p className="text-sm font-medium text-foreground whitespace-nowrap">
              <span className="text-accent">Hello!</span> Welcome to my site. Good to see you here!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeGreeting;

