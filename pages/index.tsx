import { Button, CircularProgress, Grid, Grow, IconButton, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import Scultpture from "../assets/LandingSculpture.png"
import Thesys from "../assets/Thesys.png"
import { useRouter } from "next/router";
import { useIsDesktop } from "../hooks";
import { routes } from "../const/routes";
import { ArrowDownward, ArrowRightAlt } from "@mui/icons-material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useCallback, useState } from "react";
const ChipBox = ({ label }: { label: string }) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push(`/offers/${label?.toLowerCase()}`)} sx={{ ":hover": { "background": 'none' } }}>
      <Box sx={{
        display: "flex",
        "flex-direction": "row",
        "align-items": "flex-start",
        padding: "24px 28px",
        gap: "8px",

        background: "#DFFCA4",
        "border-radius": "40px",

        /* Inside auto layout */

        flex: "none",
        order: 0,
        "flex-grow": 0
      }}>
        <Typography sx={{
          "font-style": "normal",
          "font-weight": "500",
          "font-size": "20px",
          "line-height": "24px",
          textTransform: 'none',
          /* identical to box height, or 120% */

          display: "flex",
          "align-items": "center",

          color: "#28293D",


          /* Inside auto layout */

          flex: "none",
          order: 0,
          "flex-grow": 0
        }}>
          {label}
        </Typography>
      </Box>
    </Button>
  )
}

const FaqQuestion = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <Grid item xs={12}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        gap: '24px',

        background: '#FFFFFF',
        borderRadius: '24px',
      }}>
        <Typography>{question}</Typography>
        <IconButton sx={{ border: '1px solid #28293D' }}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>
    </Grid>
  )
}

const ContactForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const send = () => {
    setName("");
    setPhone("");
    setCity("");
    setMessage("");
  }
  return (
    <>
      <Grid item xs={12} textAlign="center">
        <TextField sx={{ background: '#E3E3E3' }} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <TextField sx={{ background: '#E3E3E3' }} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <TextField sx={{ background: '#E3E3E3' }} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </Grid>
      <Grid item xs={12} textAlign="center">
        <TextField minRows={4} multiline sx={{ background: '#E3E3E3' }} placeholder="Write your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
      </Grid>
      <Grid item>
        <Button onClick={send} variant="contained" sx={{ background: 'black', padding: '10px 20px', borderRadius: '10px' }}>
          <Typography display="inline" color="whitesmoke" mr={1}>Send</Typography>
          <ArrowRightAlt />
        </Button>
      </Grid>
    </>
  )
}

const offerUrl = (degreeName: string) => `${routes.api.offers.$}?degree=${degreeName}&perPage=1`

export default function Home() {
  const isDesktop = useIsDesktop();
  const titleSize = 'clamp(2.4rem, 5vw, 4.75rem)';
  const midTextSize = 'clamp(1.5rem, 3vw, 3rem)';
  const textSize = 'clamp(1.2rem, 2.5vw, 2.4rem)';
  const smallTextSize = 'clamp(0.75rem, 1.2vw, 1.125rem)';
  const lg = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  return <Box>
    <Grid container paddingX={{ xs: 3, sm: 5, md: 8, lg: 10 }} paddingY={2} justifyContent="space-around">
      <Grid item xs={12} lg={4} sx={{ ml: { lg: '-60px' }, display: { xs: 'none', lg: 'block' } }}>
        <Image src={Scultpture} alt="Scultpture" style={{ mixBlendMode: "multiply", width: '100%', maxWidth: 500, height: 'auto' }} />
      </Grid>
      <Grid item xs={12} lg={8} paddingY={1} alignSelf={"center"}>
        <Grid container spacing={3}>
          <Grid item>
            {/* <Typography variant="caption" sx={{ fontSize: titleSize, lineHeight: '100%', letterSpacing: '-0.01em' }}>Write a research paper with us</Typography> */}
            <Typography variant="caption" sx={{ fontSize: titleSize, lineHeight: '110%', letterSpacing: '-0.01em' }}>Partner Hub</Typography>
            <Typography color="#898A95" sx={{ fontSize: smallTextSize, mt: 2, maxWidth: 600 }}>
              an online platform with research paper topics for business, and a resource for businesses looking for practical and up-to-date solutions in their field.
            </Typography>
          </Grid>
          {/*
          <Grid item>
            <Grid container spacing={1} justifyContent={"space-between"}>
              <Grid item xs={12} sm={6} md={true} textAlign="center">
                <ChipBox label="Associate" />
              </Grid>
              <Grid item xs={12} sm={6} md={true} textAlign="center">
                <ChipBox label="Bachelors" />
              </Grid>
              <Grid item xs={12} sm={6} md={true} textAlign="center">
                <ChipBox label="Masters" />
              </Grid>
              <Grid item xs={12} sm={6} md={true} textAlign="center">
                <ChipBox label="PhD" />
              </Grid>
            </Grid>
          </Grid>
          */}
        </Grid>
      </Grid>
      <Grid container maxWidth="880px" alignItems={"center"} spacing={2} marginBottom={0}>
        {/*
        <Grid item xs={12} display="flex"
          justifyContent="center"
          alignItems="center">
          <Image src={Thesys} alt="Thesys" />
        </Grid>
        <Grid item xs={12} display="flex"
          justifyContent="stretch"
          alignItems="stretch">
          <Typography color="#898A95" align="center">
            Thesys is an online platform with research paper topics for business,
            and a resource for businesses looking for practical and up-to-date solutions in their field.
          </Typography>
        </Grid>
        */}
      </Grid>
      {/*
      <Grid container>
        <Grid item mr={1} ml={lg ? -1 : 1} xs={12} md={12} lg={6} bgcolor="#DFFCA4" borderRadius={5}>
          <Grid container padding={10} spacing={3} paddingBottom={0}>
            <Grid item xs={12}>
              <Typography variant="caption" fontSize={textSize}>For Researchers</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography fontSize={smallTextSize}>researchers have the opportunity to test their skills in practice and gain new experience</Typography>
            </Grid>
            {isDesktop ? <Grid item height={400} sx={{ mx: 'auto' }} mt={7} overflow={"hidden"}>
              <Image src={Scultpture} alt="Scultpture" width={500} style={{ "transform": "scaleX(-1)" }} />
            </Grid> : <Grid item height={100} />}
          </Grid>
        </Grid>
        <Grid item mr={lg ? -1 : 1} ml={1} xs={12} md={12} lg={6} bgcolor="#28293D" borderRadius={5}>
          <Grid container padding={10} spacing={3} paddingBottom={0}>
            <Grid item xs={12}>
              <Typography color="#FFFFFF" variant="caption" fontSize={textSize}>For Business</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography color="#FFFFFF" fontSize={smallTextSize}>for companies, it is not only an opportunity to meet potential employees, but also to save time</Typography>
            </Grid>
            {isDesktop ? <Grid item height={400} sx={{ mx: 'auto' }} mt={7} overflow={"hidden"}>
              <Image src={Scultpture} alt="Scultpture" width={500} />
            </Grid> : <Grid item height={100} />}
          </Grid>
        </Grid>
      </Grid>
      */}
      {/*
      <Grid container marginY={20}>
        <Grid item>
          <Typography variant="caption" sx={{ fontSize: midTextSize, lineHeight: '125%', letterSpacing: '-0.01em' }}>
            - The goal of research is not to produce papers, but to produce knowledge that matters.
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
          Donald Stokes
          </Typography>
        </Grid>
      </Grid>
      */}
      {/*
      <Grid container>
        <Grid item>
          <Typography variant="caption" fontSize={textSize}>Where to begin?</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={20}>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="caption" fontSize={textSize}>1</Typography>
          <Typography>Consider what issues in business particularly interest you</Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="caption" fontSize={textSize}>2</Typography>
          <Typography>It is worth paying attention to industry trends and challenges in order to choose a topic that is current and of interest to others.</Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="caption" fontSize={textSize}>3</Typography>
          <Typography>Make sure you have access to enough information to be able to write your paper.</Typography>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Typography variant="caption" fontSize={textSize}>4</Typography>
          <Typography>If you plan to carry out research, make sure you can contact people who are able to help you with data collection.</Typography>
        </Grid>
      </Grid>
      */}
    </Grid>
    {/*
    <Grid container bgcolor="#E3E3E3" padding={isDesktop ? 10 : 5} spacing={5} paddingY={isDesktop ? 5 : 0} mt={5}>
      <Grid item lg={4} md={12}>
        <Grid container direction={"column"} justifyContent="space-between" height={"100%"}>
          <Grid item>
            <Typography variant="caption" fontSize={midTextSize}>Frequently asked questions</Typography>
          </Grid>
          <Grid item>
            <Typography >Haven{"'"}t found an answer? Contact us at</Typography>
            <Typography variant="caption" fontSize={midTextSize}>hello@thesys.com</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={8} md={12}>
        <Grid container spacing={1}>
          <FaqQuestion question="What are currently popular research topics in your field?" answer="" />
          <FaqQuestion question="Are there any new discoveries or trends that have an impact on research in your field?" answer="" />
          <FaqQuestion question="What are the most important research questions worth investigating in your field in the near future?" answer="" />
          <FaqQuestion question="Are there any areas that still need to be explored or that have not yet been sufficiently explored?" answer="" />
          <FaqQuestion question="What are the current methodological challenges in your field and how can they be solved?" answer="" />
          <FaqQuestion question="Are there interdisciplinary areas that could be interesting topics for scientific work?" answer="" />
        </Grid>
      </Grid>
    </Grid>
    */}
    <Grid container padding={{ xs: 3, sm: 4, md: 6 }} spacing={2} paddingY={{ xs: 1, md: 2 }} mt={-2} justifyContent="center">
      <Grid item xs={12} textAlign="center">
        <Typography variant="caption" fontSize={midTextSize}>
          Get in touch
        </Typography>
      </Grid>
      <ContactForm />
    </Grid>

  </Box>;
}
