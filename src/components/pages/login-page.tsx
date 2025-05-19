import { ConnectNavbar } from "@/components/navbar/connect-navbar";
import { Marquee } from "../magicui/marquee";

export function LoginPage() {
  return (
    <div className="flex flex-col items-center h-dvh  justify-end px-4 gap-20">
      <div />
      <div className="flex flex-col gap-3 items-center justify-center text-center">
        <p className="font-medium font-mono text-xl max-w-[300px]">
          Build & join communities, fully on Lens
        </p>
        <div className="rounded-full border border-blue-600 text-blue-600 px-2 py-1 text-xs">
          BETA
        </div>
        <p className="text-xs max-w-[260px] text-muted-foreground">
          Every post, reply and like is written to the{" "}
          <span className="text-primary-foreground">Lens blockchain</span>{" "}
          whether community can be{" "}
          <span className="text-primary-foreground">token-gated</span> or open
          to all.
        </p>
      </div>

      <div className="bg-primary rounded-3xl w-full flex flex-col justify-center items-center text-center py-6 space-y-4 overflow-hidden">
        <p className="text-xs max-w-[260px] text-muted-foreground">
          Join <span className="text-primary-foreground">10,928+</span>{" "}
          Communities Built with Lens Protocol
        </p>
        <Marquee pauseOnHover className="[--duration:40s]">
          {new Array(5).fill(0).map((_, index) => (
            <img
              key={index}
              src={`/images/community-${index}.png`}
              alt={`Login page image ${index}`}
              className="w-[64px] rounded-[24px] border border-border"
            />
          ))}
        </Marquee>
      </div>
      <ConnectNavbar />
    </div>
  );
}
