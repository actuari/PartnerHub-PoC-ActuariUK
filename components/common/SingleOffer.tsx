import { Box, Chip, Drawer, Grid, IconButton, Link, Tooltip, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { Offer } from "../../types/Offer/WithoutApplicants";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addMessage } from "../../features/responseSnackbar/reducer";
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoneIcon from '@mui/icons-material/Done';
import { majorCategoryColors } from "../../const/majorCategoryColors";
import ForumIcon from '@mui/icons-material/Forum';
import { User } from "../../types/User/Detailed";
import { SingleApplicationDetails } from "../../types/ApplicationDetails/Single";
import { routes } from "../../const/routes";
import EditorContent from "./EditorContent";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Login } from "@mui/icons-material";
import { useIsDesktop } from "../../hooks";
import OfferPage from "../offers/OfferPage";
export const parseJson = (s: string) => {
  try {
    return JSON.parse(s);
  }
  catch (e) {
    return null;
  }
}
export default function SingleOffer(props: { offer: Offer; userId?: number; detailed?: boolean; mutate?: () => void; userData?: User; micro?: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const chosenOffers: Offer[] = props.userData?.chosenOffersDetails?.map((details: SingleApplicationDetails) => details?.offer) || []
  const hasAppliedAsTeam = props.userData?.team?.chosenOffersDetails?.map(details => details?.offer)?.some(offer => offer?.id === props.offer?.id);
  const [offerOpened, setOfferOpened] = useState(false);

  const savedOffers: Offer[] = props.userData?.savedOffers || []
  const isSaved = savedOffers.some(offer => offer.id === props.offer.id);
  const hasApplied = chosenOffers.some(offer => offer?.id === props.offer.id);
  const saveOffer = useCallback((offerId: number, userId: number) => {
    fetch(`${routes.api.offers.save}/${offerId}`, {
      method: "PUT",
      body: JSON.stringify(userId)
    })
      .then(data => {
        props.mutate && props.mutate();
        dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Successfully saved", errorMessage: "Failed to save" }));
      })
      .catch(() => {
        props.mutate && props.mutate();
        dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully saved", errorMessage: "Failed to save" }));
      })

  }, [props, dispatch]);
  const content = parseJson(props?.offer?.body)
  const removeOfferFromSaved = useCallback((offerId: number, userId: number) => {
    fetch(`${routes.api.offers.unsave}/${offerId}`, {
      method: "PUT",
      body: JSON.stringify(userId)
    })
      .then(data => {
        props.mutate && props.mutate();
        dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Successfully removed from saved", errorMessage: "Failed to remove from saved" }));
      })
      .catch(() => {
        props.mutate && props.mutate();
        dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully removed from saved", errorMessage: "Failed to remove from saved" }));
      })

  }, [props, dispatch]);
  const toggleSave = isSaved ? removeOfferFromSaved : saveOffer
  const isDesktop = useIsDesktop();
  return (
    <Box
      sx={{
        padding: '32px',
        borderRadius: "24px",
        background: "white",
        height: 'calc(100% - 64px)',
      }}
    >
      {!props.detailed && <Drawer onClose={() => setOfferOpened(false)} open={offerOpened} anchor="right" ModalProps={{ keepMounted: true }}>
        <OfferPage id={`${props.offer?.id}`} onClose={() => setOfferOpened(false)} />
      </Drawer>}
      <Grid
        container
        direction="column"
        overflow="auto"
        spacing={3}
      >
        <Grid item>
          <Grid container justifyContent="space-between">
            <Grid item>
              {/* <Chip label={props.offer?.targetMajor?.category?.name?.toUpperCase()}
                sx={{ background: majorCategoryColors[props.offer?.targetMajor?.category?.name]?.bg, color: 'white', fontWeight: 700 }} /> */}
              {/* <Typography display="inline" variant="subtitle2" ml={1} sx={{ fontWeight: '400', color: '#555770' }}>{props.offer.targetDegree?.name}</Typography> */}
              {!props.detailed && <IconButton onClick={() => setOfferOpened(true)}>
                <Login />
              </IconButton>}
            </Grid>
            <Grid item>
              {!props.micro && props.userId &&
                <IconButton onClick={() => {
                  if (!props.userId) {
                    return;
                  }
                  toggleSave(props.offer.id, props.userId!);
                }}>
                  {isSaved ? <FavoriteIcon /> : <FavoriteBorderRoundedIcon />}
                </IconButton>
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h6" display="inline">{props.offer.title}</Typography>
          {!props.micro && hasApplied && hasAppliedAsTeam && <Tooltip title="Already applied">
            <DoneAllIcon />
          </Tooltip>}
          {!props.micro && ((hasApplied && !hasAppliedAsTeam) || (!hasApplied && hasAppliedAsTeam)) && <Tooltip title="Already applied">
            <DoneIcon />
          </Tooltip>}
          {!props.micro &&
            <Grid container spacing={2}>
              {(isDesktop || props.detailed) && <Grid item>
                <Typography display="inline" variant="subtitle2" sx={{ fontWeight: '400', color: '#8F90A6' }}>Published at {props.offer.publishedAt}</Typography>
              </Grid>}
              {(isDesktop || props.detailed) && <Grid item>
                <Typography display="inline" variant="subtitle2" sx={{ fontWeight: '400', color: '#555770' }}>·</Typography>
              </Grid>}
              <Grid item>
                <Typography display="inline" variant="subtitle2" sx={{ fontWeight: '400', color: '#8F90A6' }}>{(isDesktop || props.detailed) ? "Apply before: " : ""}{props.offer.due}</Typography>
              </Grid>
            </Grid>
          }
        </Grid>
        <Grid item>
          <Typography sx={{ cursor: 'pointer' }} onClick={() => { router.push(`/company/${props.offer?.employer?.id}`) }} variant="body1" display="inline" fontWeight={700}>
            {props.offer?.employer?.name}
          </Typography>
          {!props.micro && props.userData && props.userId && <IconButton onClick={() => router.push(`/chat/${props.offer?.employer?.name}`)}>
            <ForumIcon />
          </IconButton>}
        </Grid>
        {!props.micro && props.detailed && <Grid item>
          <EditorContent content={content} />
        </Grid>}
      </Grid>
    </Box >
  );
}
