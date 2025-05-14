import { Loader2Icon } from "lucide-react";

interface IconProps {
  className?: string;
}

const Loader = ({ ...props }: IconProps) => <Loader2Icon {...props} />;

export const Icons = { Loader };
