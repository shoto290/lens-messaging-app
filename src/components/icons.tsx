import {
  ArrowRightIcon,
  BellIcon,
  CirclePlusIcon,
  CompassIcon,
  DoorOpenIcon,
  Loader2Icon,
  MessageSquareIcon,
} from "lucide-react";

interface IconProps {
  className?: string;
}

const Loader = ({ ...props }: IconProps) => <Loader2Icon {...props} />;

const Discover = ({ ...props }: IconProps) => <CompassIcon {...props} />;

const Message = ({ ...props }: IconProps) => <MessageSquareIcon {...props} />;

const Create = ({ ...props }: IconProps) => <CirclePlusIcon {...props} />;

const ArrowRight = ({ ...props }: IconProps) => <ArrowRightIcon {...props} />;

const Bell = ({ ...props }: IconProps) => <BellIcon {...props} />;

const Door = ({ ...props }: IconProps) => <DoorOpenIcon {...props} />;

export const Icons = {
  Loader,
  Discover,
  Message,
  Create,
  ArrowRight,
  Bell,
  Door,
};
