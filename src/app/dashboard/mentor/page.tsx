import { Mentor } from "@/components/mentor/mentor";

export const metadata = { title: "Mentor AI" };

export default function MentorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mentor AI</h1>
        <p className="text-sm text-muted-foreground">
          Ask anything: tools, patterns, architectures, or &ldquo;what should I learn next?&rdquo;
          Mentor responds with citations to the ecosystem catalog.
        </p>
      </div>
      <Mentor />
    </div>
  );
}
