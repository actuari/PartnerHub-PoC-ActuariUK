import {
  Alert,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useCallback, useState } from "react";
import { mutate } from "swr";
import { Company } from "@prisma/client";
import { routes } from "../../const/routes";

export default function CompaniesList(props: { companies: Company[] }) {
  const [response, setResponse] = useState<{
    isSuccess?: boolean;
    isError?: boolean;
    isLoading?: boolean;
  }>({});
  const deleteCompany = useCallback((id: number) => {
    setResponse({ isLoading: true });
    fetch(`${routes.api.companies}/${id}`, {
      method: "DELETE",
    })
      .then((data) =>
        setResponse({ isSuccess: data.ok, isError: !data.ok, isLoading: false })
      )
      .then(() => mutate(routes.api.companies))
      .catch(() =>
        setResponse({ isSuccess: false, isError: true, isLoading: false })
      );
  }, []);
  const { isSuccess, isError, isLoading } = response;
  return (
    <React.Fragment>
      <Snackbar
        open={isSuccess || isError}
        autoHideDuration={6000}
        onClose={() => setResponse({})}
      >
        {isSuccess ? (
          <Alert severity="success">
            Successfully removed the company from list
          </Alert>
        ) : (
          <Alert severity="error">Failed to remove company from list</Alert>
        )}
      </Snackbar>
      <List>
        {props.companies.map((company, idx: number) => [
          <ListItem key={idx}>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography variant="subtitle1" display="inline">
                  {company.name}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      href={company.link}
                      rel="__noopener"
                      target="blank"
                    >
                      Visit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Delete" placement="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteCompany(company.id)}
                        disabled={isLoading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>,
          <Divider key={idx} />,
        ])}
      </List>
    </React.Fragment>
  );
}
