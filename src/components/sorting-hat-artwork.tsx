import Image from "next/image";

// Shared by the auth scene and the inline signup ceremony.
export function SortingHatArtwork({ className = "" }: { className?: string }) {
  return <Image
    className={`sorting-hat-artwork ${className}`}
    src="/images/sorting-hat.png"
    alt="Sorting Hat"
    width={1254}
    height={1254}
    sizes="(max-width: 640px) 205px, (max-width: 900px) 290px, (max-width: 1440px) 300px, 345px"
    priority
  />;
}
