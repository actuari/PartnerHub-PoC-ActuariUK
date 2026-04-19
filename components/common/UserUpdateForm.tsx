import React from "react";
import { University, Degree, Major } from "@prisma/client";
import { addMessage } from "../../features/responseSnackbar/reducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { routes } from "../../const/routes";
import { User } from "../../types/User/Basic";
import UserForm from "./UserForm/UserForm";
import { UserCreate } from "../../types/User/Create";
const Update = (props: { user: User; reloadUser: () => void; universities: University[]; degrees: Degree[]; majors: Major[] }) => {
    const { user } = props;
    const router = useRouter()
    const universitiesList: University[] = props.universities || []
    const degreesList: Degree[] = props.degrees || []
    const majorsList: Major[] = props.majors || []
    const dispatch = useDispatch();

    const update = (newUser: UserCreate) => {
        fetch(routes.api.users.$, {
            method: "PUT",
            body: JSON.stringify(newUser),
        })
            .then((data) => {
                dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Successfully updated", errorMessage: "Failed to update" }))
                props.reloadUser();
                router.replace(`/user/${user.email}`);
            })
            .catch(() =>
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully updated", errorMessage: "Failed to update" }))
            );
    }

    return <UserForm email={props.user.email}
        universitiesList={universitiesList} degreesList={degreesList} majorsList={majorsList} action={update}
        actionString={"Update"} cancelAction={() => {
            router.back();
        }} user={props.user} />
};

export default Update;
