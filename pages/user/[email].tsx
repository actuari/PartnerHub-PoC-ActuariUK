import { Avatar, Badge, Box, Card, CardContent, Grid, IconButton, Slide, Tooltip, Typography } from "@mui/material";
import { useEmployer, useGetEmail } from "../../auth/client";
import { getCvSrc, getImageSrc, useFetch } from "../../hooks";
import { routes } from "../../const/routes";
import { useRouter } from "next/router";
import { User } from "../../types/User/Basic";
import LoaderCenter from "../../components/common/LoaderCenter";
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditorContent from "../../components/common/EditorContent";
import { parseJson } from "../../components/common/SingleOffer";
import { SettingsOutlined, SimCardDownload } from "@mui/icons-material";
export default function Account() {
  const router = useRouter();
  const email = router.query?.email as string || "";
  const { data: userData, isLoading } = useFetch(`${routes.api.users.basic}/${email}`);
  const user: User | undefined = userData?.data;
  const myEmail = useGetEmail();
  const isMySite = email === myEmail;
  const employer = useEmployer();
  const showCV = !!employer || isMySite;
  return isLoading ? <LoaderCenter /> : user ? (
    <Box paddingX={2}>
      <Slide in={true} direction="right" mountOnEnter unmountOnExit>
        <Grid container padding={5} spacing={1}>
          <Grid item>
            <Badge overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={isMySite ? <IconButton onClick={() => router.push('/user/settings')}><Avatar><SettingsOutlined /></Avatar></IconButton> : <></>}>
              <Avatar src={getImageSrc(user?.email)} sx={{ width: '150px', height: '150px' }} />
            </Badge>
          </Grid>
          <Grid item alignSelf="end">
            <Typography variant="h3">{`${user?.name} ${user?.surname}`}</Typography>
          </Grid>
        </Grid>
      </Slide>
      <Slide in={true} direction="up" mountOnEnter unmountOnExit>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Grid container spacing={3} paddingX={4}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Details</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <SchoolIcon />
                    <Typography display="inline"> {user?.university?.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <WorkIcon />
                    <Typography display="inline"> {user?.major?.name} ({user?.major?.category?.name})</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <EmojiEventsIcon />
                    <Typography display="inline"> {user?.degree?.name} (Year: {user?.year})</Typography>
                  </Grid>
                  <Grid item xs={12} textAlign="right">
                    {showCV && <Tooltip title="Download CV">
                      <IconButton download href={getCvSrc(email)} target="_blank">
                        <SimCardDownload />
                      </IconButton>
                    </Tooltip>}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h4">Bio</Typography>
                <EditorContent content={parseJson(user?.bio || "")} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    </Box>
  ) : <></>;
}
