import { ArrowRightIcon, Loader2Icon } from "lucide-react";

interface IconProps {
  className?: string;
}

const Loader = ({ ...props }: IconProps) => <Loader2Icon {...props} />;

const Discover = ({ ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    {...props}
  >
    <path
      d="M20.6534 9.34667L18.248 16.5613C18.1171 16.9541 17.8966 17.311 17.6038 17.6038C17.311 17.8965 16.9541 18.1171 16.5614 18.248L9.3467 20.6533L11.752 13.4387C11.8829 13.0459 12.1035 12.689 12.3963 12.3962C12.689 12.1035 13.0459 11.8829 13.4387 11.752L20.6534 9.34667Z"
      stroke="#FAFAFA"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 28.3333C22.3638 28.3333 28.3334 22.3638 28.3334 15C28.3334 7.63619 22.3638 1.66666 15 1.66666C7.63622 1.66666 1.66669 7.63619 1.66669 15C1.66669 22.3638 7.63622 28.3333 15 28.3333Z"
      stroke="#FAFAFA"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Message = ({ ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <path
      d="M24 12H26.6667C27.3739 12 28.0522 12.2809 28.5523 12.781C29.0524 13.2811 29.3333 13.9594 29.3333 14.6667V29.3333L24 24H16C15.2927 24 14.6145 23.719 14.1144 23.2189C13.6143 22.7188 13.3333 22.0406 13.3333 21.3333V20M18.6667 12C18.6667 12.7072 18.3857 13.3855 17.8856 13.8856C17.3855 14.3857 16.7072 14.6667 16 14.6667H7.99999L2.66666 20V5.33332C2.66666 3.86666 3.86666 2.66666 5.33332 2.66666H16C16.7072 2.66666 17.3855 2.94761 17.8856 3.4477C18.3857 3.9478 18.6667 4.62608 18.6667 5.33332V12Z"
      stroke="#A1A1AA"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Create = ({ ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <path
      d="M10.6667 16H21.3333M16 10.6667V21.3333M29.3333 16C29.3333 23.3638 23.3638 29.3333 16 29.3333C8.63619 29.3333 2.66666 23.3638 2.66666 16C2.66666 8.63619 8.63619 2.66666 16 2.66666C23.3638 2.66666 29.3333 8.63619 29.3333 16Z"
      stroke="#A1A1AA"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ArrowRight = ({ ...props }: IconProps) => <ArrowRightIcon {...props} />;

export const Icons = { Loader, Discover, Message, Create, ArrowRight };
