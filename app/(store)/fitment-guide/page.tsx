import type { Metadata } from "next";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Fitment Guide" };

const WHEEL_ROWS = [
  { vehicleType: "Sedans", diameters: "16 – 18 inch", boltPattern: "5x108 / 5x114.3 (most common)" },
  { vehicleType: "SUVs & Crossovers", diameters: "18 – 22 inch", boltPattern: "5x114.3 / 6x139.7" },
  { vehicleType: "Trucks & Vans", diameters: "17 – 20 inch", boltPattern: "6x139.7 / 8x165.1" },
];

export default function FitmentGuidePage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Fitment Guide</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Most parts on this site are Universal Fit and install on any sedan, SUV, or truck. Wheels and tires
        are size-specific — check your vehicle&apos;s door-jamb sticker or owner&apos;s manual before ordering.
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle type</TableHead>
            <TableHead>Common wheel diameters</TableHead>
            <TableHead>Common bolt patterns</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {WHEEL_ROWS.map((row) => (
            <TableRow key={row.vehicleType}>
              <TableCell className="font-medium">{row.vehicleType}</TableCell>
              <TableCell>{row.diameters}</TableCell>
              <TableCell>{row.boltPattern}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How to confirm your fitment</h2>
        <p>
          <strong className="text-foreground">Wheel diameter:</strong> Check the sidewall of your current tire —
          it&apos;s the last number in the size code (e.g. the &ldquo;16&rdquo; in 205/55R16).
        </p>
        <p>
          <strong className="text-foreground">Bolt pattern:</strong> Listed on your vehicle&apos;s manufacturer
          spec sheet, or measure the number of studs and the diameter of the circle they sit on.
        </p>
        <p>
          <strong className="text-foreground">Not sure?</strong>{" "}
          <a href="/contact" className="underline underline-offset-4">
            Contact us
          </a>{" "}
          with your vehicle&apos;s year, make, and model and we&apos;ll confirm compatibility before you order.
        </p>
      </div>
    </div>
  );
}
