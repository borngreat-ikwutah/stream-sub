import { Image } from "@unpic/react";
import Navbar from "./navbar";

export function Hero() {
  return (
    <div className="relative isolate min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Full Viewport Background */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/stream-sub-hero.png"
          alt="Privacy-preserving creator subscriptions"
          className="h-full w-full object-cover opacity-60 dark:opacity-50"
          layout="fullWidth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <main className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-14">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl lg:max-w-4xl">
            {/* Badge */}
            <div className="mb-8 flex">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-primary hover:text-foreground transition-all duration-300 cursor-pointer backdrop-blur-md bg-background/30">
                <span className="font-semibold text-primary">ZK-Powered</span>{" "}
                <span className="font-['Geologica_Variable']">
                  Private creator verification on Mantle.
                </span>{" "}
                <a href="#" className="font-semibold text-primary ml-1">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-['Orbitron_Variable'] text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-foreground">
                Earn Recurring Support
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 animate-pulse">
                Without Revealing Yourself.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg leading-8 text-muted-foreground font-['Geologica_Variable'] max-w-xl">
              StreamSub lets creators receive tips and recurring subscriptions
              on-chain with privacy-preserving verification. No custody. No
              doxxing. Just compliant, recurring income on Mantle.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
              >
                Become a creator
              </a>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors flex items-center gap-2 group"
              >
                View demo{" "}
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-14 border-t border-border pt-8 flex gap-8 items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-background grayscale hover:grayscale-0 transition-all"
                    src={`https://randomuser.me/api/portraits/thumb/men/${i + 30}.jpg`}
                    alt=""
                  />
                ))}
              </div>
              <div className="text-sm leading-6">
                <p className="font-semibold text-foreground">
                  Privacy-first creators
                </p>
                <p className="text-muted-foreground">
                  Subscriptions powered by ZK & Mantle
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
