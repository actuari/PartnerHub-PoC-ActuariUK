import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";
import { setPriority } from "../../../features/userPriority/reducer";
import { useDispatch } from "react-redux";
import { Avatar, Divider, ListItemIcon, MenuItem } from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import StyledMenu from "./StyledMenu";
import { Employer } from "../../../types/Employer";
interface Props {
    employer: Employer | undefined,
    hasBothAccounts: boolean | undefined,
    anchorEl: null | HTMLElement,
    setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>
}
export default function EmployerMenu({ employer, hasBothAccounts, anchorEl, setAnchorEl }: Props) {
    const handleClose = () => {
        setAnchorEl(null);
    };
    const dispatch = useDispatch();
    const router = useRouter();
    const open = Boolean(anchorEl);

    return (
        <StyledMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
        >
            <MenuItem onClick={() => router.push(`/company/${employer?.companyId}`)}>
                <Avatar /> Company Profile
            </MenuItem>
            {hasBothAccounts &&
                <MenuItem onClick={() => dispatch(setPriority(!!employer ? "user" : "employer"))}>
                    {`Switch to ${!!employer ? "student" : "employer"} account`}
                </MenuItem>}
            <Divider />
            {employer?.canUpdateCompanyDetails && <MenuItem onClick={() => router.push(`/company/settings`)}>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>}
            <MenuItem onClick={() => signOut()}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </StyledMenu>
    )
}
