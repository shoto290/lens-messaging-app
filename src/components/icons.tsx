import {
  ArrowRightIcon,
  BellIcon,
  CirclePlusIcon,
  CompassIcon,
  DoorOpenIcon,
  ChevronLeftIcon,
  SendIcon,
  MessagesSquareIcon,
  UsersIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
  EllipsisIcon,
  LogOutIcon,
  WalletIcon,
  UserPlusIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-react";

interface IconProps {
  className?: string;
}

const Loader = ({ ...props }: IconProps) => <LoaderIcon {...props} />;

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

const Ellipsis = ({ ...props }: IconProps) => <EllipsisIcon {...props} />;

const LogOut = ({ ...props }: IconProps) => <LogOutIcon {...props} />;

const Wallet = ({ ...props }: IconProps) => <WalletIcon {...props} />;

const UserPlus = ({ ...props }: IconProps) => <UserPlusIcon {...props} />;

const Search = ({ ...props }: IconProps) => <SearchIcon {...props} />;

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
  Ellipsis,
  LogOut,
  Wallet,
  UserPlus,
  Search,
};
