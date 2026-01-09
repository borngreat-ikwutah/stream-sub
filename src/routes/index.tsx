import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle, ThemeSelect } from "../components/ui/theme-toggle";
import { Hero } from "~/components/hero";

export const Route = createFileRoute("/")({
  component: Hero,
});
