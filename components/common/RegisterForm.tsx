import type { University, Degree, Major } from "@prisma/client";
import { useRegister } from "../../auth/client";
import { addMessage } from "../../features/responseSnackbar/reducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { routes } from "../../const/routes";
import LoaderCenter from "./LoaderCenter";
import UserForm from "./UserForm/UserForm";
import { UserCreate } from "../../types/User/Create";
import { mutate } from "swr";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
type Props = {
    universities: University[],
    degrees: Degree[],
    majors: Major[]
}
const RegisterForm = ({ universities, degrees, majors }: Props) => {
    const router = useRouter()
    const { name, surname, email } = useRegister();
    const { status } = useSession();
    const callback = () => {
        signOut();
        const callbackUrl = sessionStorage.getItem('callbackUrl')
        if (callbackUrl) {
            sessionStorage.removeItem('callbackUrl')
            router.push(callbackUrl)
        } else {
            router.push('/')
        }
    }
    const universitiesList: University[] = universities || []
    const degreesList: Degree[] = degrees || []
    const majorsList: Major[] = majors || []
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status]);

    const register = (newUser: UserCreate) => {
        fetch(routes.api.users.$, {
            method: "POST",
            body: JSON.stringify(newUser),
        })
            .then((data) => {
                dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: "Successfully registered", errorMessage: "Failed to register" }))
                if (data.ok) {
                    mutate(routes.api.users.email).then(callback)
                }
            })
            .catch(() =>
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: "Successfully registered", errorMessage: "Failed to register" }))
            );
    }

    const isLoading = status === "loading" || !email;

    return isLoading ? <LoaderCenter /> : <UserForm email={email as string}
        user={{
            name: name || "",
            surname: surname || "",
            email: email as string
        }}
        universitiesList={universitiesList} degreesList={degreesList} majorsList={majorsList} action={register}
        actionString={"Register"} cancelAction={() => {
            callback();
        }} />
};

export default RegisterForm;
