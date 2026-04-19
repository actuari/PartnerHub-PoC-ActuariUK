import { useIsDesktop } from "../../hooks";
import Desktop from "./Desktop/Desktop";
import Mobile from "./Mobile/Mobile";

export default function Header() {
    const isDesktop = useIsDesktop();
    return isDesktop ? <Desktop /> : <Mobile />
}