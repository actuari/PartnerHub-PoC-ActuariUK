import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Employer } from "../../../types/Employer";
interface Props {
    menuOpen: boolean,
    setMenuOpen: Dispatch<SetStateAction<boolean>>,
    employer: Employer
}
export default function EmployerSites({ menuOpen, setMenuOpen, employer }: Props) {
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
                <ListItemButton onClick={() => router.push("/company/offers")}>
                    <ListItemText primary={`${employer?.company?.name} Offers`} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/company/members")}>
                    <ListItemText primary={"Company Members"} />
                </ListItemButton>
                <ListItemButton onClick={() => router.push("/company/chat/main")}>
                    <ListItemText primary={"Chat"} />
                </ListItemButton>
            </List>
        </Drawer>
    )
}
