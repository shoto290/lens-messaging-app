import {
  ArrowRightIcon,
  BellIcon,
  CirclePlusIcon,
  CompassIcon,
  DoorOpenIcon,
  Loader2Icon,
  ChevronLeftIcon,
  SendIcon,
  MessagesSquareIcon,
  UsersIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
} from "lucide-react";

interface IconProps {
  className?: string;
}

const Loader = ({ ...props }: IconProps) => <Loader2Icon {...props} />;

const Discover = ({ ...props }: IconProps) => <CompassIcon {...props} />;

const Message = ({ ...props }: IconProps) => <MessagesSquareIcon {...props} />;

const Create = ({ ...props }: IconProps) => <CirclePlusIcon {...props} />;

const ArrowRight = ({ ...props }: IconProps) => <ArrowRightIcon {...props} />;

const Bell = ({ ...props }: IconProps) => <BellIcon {...props} />;

const Door = ({ ...props }: IconProps) => <DoorOpenIcon {...props} />;

const ChevronLeft = ({ ...props }: IconProps) => <ChevronLeftIcon {...props} />;

const Send = ({ ...props }: IconProps) => <SendIcon {...props} />;

const Users = ({ ...props }: IconProps) => <UsersIcon {...props} />;

const ArrowLeft = ({ ...props }: IconProps) => <ArrowLeftIcon {...props} />;

const Plus = ({ ...props }: IconProps) => <PlusCircleIcon {...props} />;

export const Icons = {
  Loader,
  Discover,
  Message,
  Create,
  ArrowRight,
  Bell,
  Door,
  ChevronLeft,
  Send,
  Users,
  ArrowLeft,
  Plus,
};
