import React from "react";
import { Card, CardContent, List, Typography } from "@mui/material";
import { Team } from "../../types/Team";
import UserSummary from "./UserSummary";
const TeamDetails = (props: { team: Team; children: JSX.Element }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h4" align="left">{props.team.name}</Typography>
                <List>
                    {
                        props.team.members.map(member => <UserSummary user={member} key={member?.id} />)
                    }
                </List>
                {props.children}
            </CardContent>
        </Card>
    );
};

export default TeamDetails;
