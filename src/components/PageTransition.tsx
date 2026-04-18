"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  AnchorHTMLAttributes,
  MouseEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";

const TRANSITION_MS = 400;

type TransitionContextValue = {
  navigate: (href: string) => void;
  back: () => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  back: () => {},
});

export function useTransitionNavigate() {
  return useContext(TransitionContext).navigate;
}

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    setIsExiting(false);
    setIsEntering(true);
    const t = setTimeout(() => setIsEntering(false), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      setIsExiting(true);
      setTimeout(() => router.push(href), TRANSITION_MS);
    },
    [pathname, router]
  );

  const back = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => router.back(), TRANSITION_MS);
  }, [router]);

  const opacityClass = isExiting
    ? "opacity-0 scale-95"
    : isEntering
      ? "opacity-0 scale-95 animate-fadeIn"
      : "opacity-100 scale-100";

  return (
    <TransitionContext.Provider value={{ navigate, back }}>
      <div
        className={`${opacityClass} transition-all duration-400 ease-out`}
      >
        {children}
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = {
  href: string;
  children: React.ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function TransitionLink({
  href,
  children,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const navigate = useTransitionNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    onClick?.(e);
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
