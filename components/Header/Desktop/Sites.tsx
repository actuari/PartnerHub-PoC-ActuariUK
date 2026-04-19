import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useRouter } from "next/router";
import { useEmployer, useUser } from "../../../auth/client";
import Thesys from "../../../assets/Thesys.png"
import Rect from "../../../assets/Rectangle.png"
import Image from "next/image";
const StyledTab = (props: any) => <Tab {...props} sx={{
    textTransform: 'none',
    margin: '0 0.5rem',
    fontSize: '1rem'
}} />
export default function Sites() {
    const router = useRouter();
    const tab = router.pathname;
    const userSite = useUser(true);
    const employer = useEmployer(true);

    return (
        <Grid container spacing={0} alignItems="center">
            <Grid item>
                <Button
                    variant="text"
                    onClick={() => {
                        router.replace("/")
                    }}
                    color="inherit"
                    sx={{ textTransform: "none" }}
                >
                    <Image src={Thesys} alt="logo" />
                </Button>
            </Grid>
            <Grid item marginX={1}>
                <Image src={Rect} alt="rect" />
            </Grid>

            <Tabs value={tab} onChange={(_, val) => {
                router.push(val);
            }}>
                <StyledTab label="Offers" value="/offers/all" />
                {userSite?.email && [
                    <StyledTab label="Saved" value="/offers/saved" key="Saved" />,
                    <StyledTab label="For you" value="/offers/for-you" key="For you" />,
                    <StyledTab label="Already applied" value="/offers/applied" key="Already applied" />,
                    <StyledTab label="Teams" value="/teams" key="Teams" />
                ]}
                {employer?.email && [
                    <StyledTab label={`${employer?.company?.name} Offers`} value="/company/offers" key="Company Offers" />,
                    <StyledTab label="Members" value="/company/members" key="Members" />,
                ]
                }
            </Tabs>
        </Grid>
    )
}
