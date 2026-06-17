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
          // step back; TanStack uses router.history
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
      nav({
        to: pathname as never,
        search: searchObj as never,
        replace: opts?.replace,
      });
    },
    [nav, router],
  );
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const search = useRouterState({ select: (s) => s.location.search }) as Record<string, unknown>;
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
      nav({ search: obj as never });
    },
    [nav],
  );
  return [params, setSearch];
}

export function useLocation() {
  const loc = useRouterState({ select: (s) => s.location });
  return {
    pathname: loc.pathname,
    search: loc.searchStr ?? "",
    hash: loc.hash ?? "",
    state: (loc as { state?: unknown }).state ?? null,
    key: loc.href,
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTSParams({ strict: false }) as T;
}

type LinkProps = React.ComponentProps<"a"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, replace, state: _state, ...rest },
  ref,
) {
  return (
    <TSLink ref={ref} to={to as never} replace={replace} {...(rest as Record<string, unknown>)}>
      {children}
    </TSLink>
  );
});

export type NavLinkProps = LinkProps & {
  end?: boolean;
  className?: string | ((args: { isActive: boolean }) => string);
  style?: React.CSSProperties | ((args: { isActive: boolean }) => React.CSSProperties);
  children?: React.ReactNode | ((args: { isActive: boolean }) => React.ReactNode);
};

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, style, children, ...rest },
  ref,
) {
  return (
    <TSLink
      ref={ref}
      to={to as never}
      activeOptions={{ exact: end }}
      {...(rest as Record<string, unknown>)}
    >
      {(state) => {
        const isActive = state.isActive;
        const cls = typeof className === "function" ? className({ isActive }) : className;
        const st = typeof style === "function" ? style({ isActive }) : style;
        const ch = typeof children === "function" ? children({ isActive }) : children;
        return (
          <span className={cls} style={st}>
            {ch}
          </span>
        );
      }}
    </TSLink>
  );
});
