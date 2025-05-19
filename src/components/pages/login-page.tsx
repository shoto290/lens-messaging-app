import { ConnectNavbar } from "@/components/navbar/connect-navbar";

export function LoginPage() {
  return (
    <div className="flex flex-col items-center h-dvh bg-white justify-between px-4">
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
      <div className="bg-secondary rounded-3xl p-3">
        <img src="/images/landing-requirement.png" alt="Login page image" />
      </div>
      <div className="bg-secondary rounded-3xl w-full flex flex-col justify-center items-center text-center py-6 space-y-4 ">
        <p className="text-xs max-w-[260px] text-muted-foreground">
          Join <span className="text-primary-foreground">10,928+</span>{" "}
          Communities Built with Lens Protocol
        </p>
        <img
          src="/images/community.png"
          alt="Login page image"
          className="w-full h-full object-cover pl-3"
        />
      </div>
      <ConnectNavbar />
    </div>
  );
}
