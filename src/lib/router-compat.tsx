// Compatibility shim mapping a subset of react-router-dom v6 APIs onto
// @tanstack/react-router so files ported from the Vite/React-Router app
// keep working without rewrites.
import {
  Link as TSLink,
  useNavigate as useTSNavigate,
  useParams as useTSParams,
  useRouterState,
  useRouter,
} from "@tanstack/react-router";
import * as React from "react";

export type To = string | number;

export function useNavigate() {
  const nav = useTSNavigate();
  const router = useRouter();
  return React.useCallback(
    (to: To, opts?: { replace?: boolean }) => {
      if (typeof to === "number") {
        if (to < 0) {
          for (let i = 0; i < Math.abs(to); i++) router.history.back();
        } else {
          for (let i = 0; i < to; i++) router.history.forward();
        }
        return;
      }
      const [pathname, search = ""] = to.split("?");
      const searchObj: Record<string, string> = {};
      if (search) {
        new URLSearchParams(search).forEach((v, k) => {
          searchObj[k] = v;
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nav({ to: pathname as any, search: searchObj as any, replace: opts?.replace });
    },
    [nav, router],
  );
}

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string>) => void,
] {
  const search = useRouterState({ select: (s) => s.location.search }) as unknown as Record<string, unknown>;
  const params = new URLSearchParams();
  Object.entries(search || {}).forEach(([k, v]) => {
    if (v != null) params.set(k, String(v));
  });
  const nav = useTSNavigate();
  const setSearch = React.useCallback(
    (next: URLSearchParams | Record<string, string>) => {
      const obj: Record<string, string> = {};
      if (next instanceof URLSearchParams) {
        next.forEach((v, k) => (obj[k] = v));
      } else {
        Object.assign(obj, next);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nav({ search: obj as any });
    },
    [nav],
  );
  return [params, setSearch];
}

export function useLocation() {
  const loc = useRouterState({ select: (s) => s.location });
  return {
    pathname: loc.pathname,
    search: (loc as { searchStr?: string }).searchStr ?? "",
    hash: loc.hash ?? "",
    state: (loc as { state?: unknown }).state ?? null,
    key: loc.href,
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTSParams({ strict: false }) as T;
}

type LinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, replace, state: _state, ...rest },
  ref,
) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TSLink ref={ref} to={to as any} replace={replace} {...(rest as any)}>
      {children}
    </TSLink>
  );
});

export type NavLinkProps = Omit<React.ComponentProps<"a">, "href" | "className" | "style" | "children"> & {
  to: string;
  end?: boolean;
  replace?: boolean;
  className?: string | ((args: { isActive: boolean; isPending: boolean }) => string);
  style?: React.CSSProperties | ((args: { isActive: boolean; isPending: boolean }) => React.CSSProperties);
  children?:
    | React.ReactNode
    | ((args: { isActive: boolean; isPending: boolean }) => React.ReactNode);
};

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, style, children, replace, ...rest },
  ref,
) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const args = { isActive, isPending: false };
  const cls = typeof className === "function" ? className(args) : className;
  const st = typeof style === "function" ? style(args) : style;
  const ch = typeof children === "function" ? children(args) : children;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TSLink ref={ref} to={to as any} replace={replace} className={cls} style={st} {...(rest as any)}>
      {ch as React.ReactNode}
    </TSLink>
  );
});
