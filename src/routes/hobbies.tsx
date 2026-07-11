import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import LoadingImage from "@/components/portfolio/LoadingImage";
import { blockSectionGenerationOnce } from "@/hooks/use-section-generating";

export const Route = createFileRoute("/hobbies")({
  head: () => ({
    meta: [
      { title: "Blogs & Certificates" },
      { name: "description", content: "A look at my blogs and the certificates I've earned." },
    ],
  }),
  component: HobbiesPage,
});

type Item = { title: string; description: string; image: string };

const items: Item[] = [
  {
    title: "Photography",
    description:
      "Capturing candid moments and landscapes on weekends. I enjoy experimenting with natural light, composition and quiet street scenes.",
    image: "/images/ach1.jpg",
  },
  {
    title: "Open Source",
    description:
      "Contributing to developer tools and writing small libraries. It keeps me sharp and connected with the wider engineering community.",
    image: "/images/ach2.jpg",
  },
  {
    title: "Reading & Writing",
    description:
      "Long-form essays on systems design, distributed computing, and the craft of building software with intention.",
    image: "/images/ach3.jpg",
  },
  {
    title: "Cloud Practitioner Certificate",
    description:
      "AWS Certified Cloud Practitioner — fundamentals of AWS services, billing, security, and architecture best practices.",
    image: "/images/certi1.jpg",
  },
  {
    title: "Full Stack Certificate",
    description:
      "Hands-on certification covering modern web stacks, REST/GraphQL APIs, and production-grade deployment workflows.",
    image: "/images/cert2.jpg",
  },
];

function HobbiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto section-padding">
        <Link
          to="/"
          hash="hobbies"
          onClick={() => blockSectionGenerationOnce("hobbies")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          Blogs and Certs
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mb-16">
          Recently I did something...
        </p>

        <div className="space-y-20 md:space-y-28">
          {items.map((item, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="rounded-2xl overflow-hidden bg-secondary aspect-[4/3] border border-border">
                  <LoadingImage src={item.image} alt={item.title} rounded="rounded-2xl" />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Link
        to="/"
        hash="hobbies"
        onClick={() => blockSectionGenerationOnce("hobbies")}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-medium text-xs shadow-md hover:scale-105 transition-transform"
        aria-label="Back to Hobbies"
      >
        <ArrowLeft size={12} /> Back to Hobbies
      </Link>
    </div>
  );
}
