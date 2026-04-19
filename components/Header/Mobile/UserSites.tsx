import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
interface Props {
    menuOpen: boolean,
    setMenuOpen: Dispatch<SetStateAction<boolean>>
}
export default function UserSites({ menuOpen, setMenuOpen }: Props) {
    const router = useRouter();

    return (
        <Drawer
            anchor="top"
            open={menuOpen}
            onClick={() => setMenuOpen(false)}
            onClose={() => setMenuOpen(false)}
        >
            <List>
                <ListItemButton onClick={() => router.push("/offers/all")}>
                    <ListItemText primary={"Offers"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/offers/saved")}>
                    <ListItemText primary={"Saved Offers"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/offers/for-you")}>
                    <ListItemText primary={"For You"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/offers/applied")}>
                    <ListItemText primary={"Already applied"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/teams")}>
                    <ListItemText primary={"Teams"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/chat/main")}>
                    <ListItemText primary={"Chat"} />
                </ListItemButton>
            </List>
        </Drawer>
    )
}
