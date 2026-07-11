import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useSectionGenerating } from "@/hooks/use-section-generating";
import SectionLabel from "./SectionLabel";
import LoadingImage from "./LoadingImage";

const achievementsData = [
  {
    title: "Google Developers Achievements",
    description: "Submitted an innovative project proposal on Secure Voting System",
    details: "Co-authored a research paper titled 'Optimizing Neural Network Inference Using Adaptive Pruning Strategies' published in IEEE International Conference. The paper proposed a novel pruning algorithm that reduced model size by 40% with minimal accuracy loss.",
    image: "/images/ach2.jpg",
    date: "January 2025",
  },
  {
    title: "Best Paper Award",
    description: "Won the best paper award for presenting research paper in a confrence among 100+ teams.",
    details: "Led a team of 4 to build an AI-powered accessibility tool in 36 hours. The solution utilized computer vision and NLP to assist visually impaired users. Competed against 500+ teams from across the country.",
    image: "/images/ach1.jpg",
    date: "March 2025",
  },
  {
    title: "Google GenAI Achievement",
    description: "Completed tracks on AI effectively and received the official certification.",
    details: "Contributed 50+ pull requests to a widely-used open-source developer toolkit. Implemented key features including a plugin system and CLI improvements. The project has over 1000 stars on GitHub.",
    image: "/images/ach3.jpg",
    date: "2024",
  },
];

const CARD_WIDTH = 540;
const GAP = 24;
const ITEM_TOTAL = CARD_WIDTH + GAP;
const SPEED = 120;
const COMPACT_HEIGHT = 200;

const Achievements = () => {
  const [offset, setOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const totalWidth = achievementsData.length * ITEM_TOTAL;
  const { ref: sectionRef, phase } = useSectionGenerating<HTMLElement>({ sectionId: "achievements" });

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time;
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (!isPausedRef.current) {
      setOffset((prev) => {
        const next = prev + (SPEED * delta) / 1000;
        return next >= totalWidth ? next - totalWidth : next;
      });
    }
    animRef.current = requestAnimationFrame(animate);
  }, [totalWidth]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Measure the expanded list so we can animate the container height precisely.
  useLayoutEffect(() => {
    if (!expandedRef.current) return;
    const measure = () => {
      if (expandedRef.current) setExpandedHeight(expandedRef.current.scrollHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(expandedRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const isHoveredRef = useRef(false);

  const handleEnter = () => {
    isHoveredRef.current = true;
    isPausedRef.current = true;
    setIsExpanded(true);
  };
  const handleLeave = () => {
    isHoveredRef.current = false;
    // Keep expanded; collapse only when user scrolls up while cursor is out.
  };

  // Collapse the expanded stack when the user scrolls up AND cursor is not on the stack.
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (isExpanded && y < lastY && !isHoveredRef.current) {
        isPausedRef.current = false;
        setIsExpanded(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isExpanded]);

  const renderCards = () => {
    const items: { achievement: (typeof achievementsData)[0]; origIndex: number; position: number }[] = [];
    for (let set = -1; set <= 2; set++) {
      achievementsData.forEach((a, i) => {
        items.push({
          achievement: a,
          origIndex: i,
          position: set * totalWidth + i * ITEM_TOTAL - offset,
        });
      });
    }
    return items;
  };

  return (
    <section id="achievements" ref={sectionRef} className="section-padding border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20 mb-10">
            <div>
              <SectionLabel label="Achievements" phase={phase} />
            </div>
            <div />
          </div>
        </motion.div>

        <div className="stream-reveal" data-ready={phase === "ready"}>
          <div className="mt-20 flex flex-col items-center justify-center" data-ai-anchor="marquee-stack-gap">
            <p className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider mb-6 text-center">
              Some are these and counting...
            </p>
            <div
              className="relative w-full max-w-[1000px] mx-auto"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {/* Single height-animated wrapper — no gap, no wobble */}
              <div
                className="relative w-full overflow-hidden transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  height: isExpanded
                    ? `${expandedHeight || COMPACT_HEIGHT}px`
                    : `${COMPACT_HEIGHT}px`,
                }}
              >
                {/* Compact marquee — cross-fades out */}
                <div
                  className={`absolute inset-x-0 top-0 transition-opacity duration-500 ease-out ${
                    isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="relative w-full h-[200px] rounded-xl border border-white/25 bg-card overflow-hidden">
                    <div className="relative w-full h-full overflow-hidden">
                      {renderCards().map(({ achievement, position }, i) => (
                        <div
                          key={`stack-marquee-${achievement.title}-${i}`}
                          className="absolute top-0 h-full flex items-center group/card"
                          style={{
                            transform: `translateX(${position}px)`,
                            width: `${CARD_WIDTH}px`,
                            willChange: "transform",
                          }}
                        >
                          <div className="mx-3 flex h-[180px] w-full rounded-lg border-l-2 border-l-accent border-y border-border border-r-2 border-r-accent bg-background/50 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05] will-change-transform">
                            <div className="relative w-[240px] h-full flex-shrink-0">
                              <LoadingImage src={achievement.image} alt={achievement.title} rounded="rounded-none" />
                            </div>
                            <div className="flex flex-col justify-center px-5 flex-1 min-w-0">
                              <h4 className="font-display text-lg md:text-xl font-bold text-foreground truncate leading-tight">
                                {achievement.title}
                              </h4>
                              <p className="text-[11px] font-medium uppercase tracking-wider text-accent mt-1">
                                {achievement.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expanded cards — staggered split, with padding to avoid hover-zoom clipping */}
                <div
                  ref={expandedRef}
                  className={`absolute inset-x-0 top-0 transition-opacity duration-300 ease-out ${
                    isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-6">
                    <div className="flex flex-col gap-5">
                      {achievementsData.map((achievement, idx) => (
                        <motion.div
                          key={achievement.title}
                          initial={false}
                          animate={
                            isExpanded
                              ? { opacity: 1, y: 0 }
                              : { opacity: 0, y: -16 }
                          }
                          transition={{
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                            delay: isExpanded ? 0.1 + idx * 0.12 : (achievementsData.length - 1 - idx) * 0.06,
                          }}
                          className="group/card relative w-full rounded-xl border-2 border-border bg-card overflow-hidden hover:bg-white/10 hover:border-white/30 hover:scale-[1.03] hover:z-10 hover:shadow-2xl transition-[transform,box-shadow,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                        >
                          <div className="flex h-auto min-h-[182px]">
                            <div className="relative w-[240px] h-[182px] flex-shrink-0">
                              <LoadingImage src={achievement.image} alt={achievement.title} rounded="rounded-none" />
                            </div>
                            <div className="p-6 flex flex-col justify-between flex-1 min-w-0">
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Trophy size={18} className="text-accent shrink-0" />
                                    <h4 className="font-display text-lg font-bold text-foreground truncate">
                                      {achievement.title}
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
