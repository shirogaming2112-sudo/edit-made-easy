// Compatibility shim re-exporting react-router-dom v6/v7 APIs under the
// original module path so pages keep working without rewrites.
export {
  Link,
  NavLink,
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
export type { NavLinkProps } from "react-router-dom";

export type To = string | number;
