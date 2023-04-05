import { FormField} from '@/components/shared/FormField';
import {Alert, Box, Button, Checkbox, FormControlLabel, Grid} from '@mui/material';
import {yupResolver} from "@hookform/resolvers/yup";
import React, {useEffect, useState} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LoginFormSchema } from '@/utils/FormSchemas';
import Link from "next/link";
import {useRouter} from "next/router";
import {useLoginUserMutation} from "@/services/authService";
import styles from "./loginRegister.module.scss";
import { red } from '@mui/material/colors'
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import styles from "./loginRegister.module.scss"
import { useAppDispatch } from '@/hooks/useAppHooks';
import { setUserData } from '@/store/slices/userSlice';


interface FormProps {
}

const Form: React.FC<FormProps> = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()
    const [loginUser, {isLoading, error}] = useLoginUserMutation()
    const dispatch = useAppDispatch()

    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(LoginFormSchema),
    });

    useEffect(() => {
        // @ts-ignore
        setErrorMessage(error?.data?.message || '')
    }, [error])

    const onSubmit = async (dto: any) => {
        setErrorMessage('');
        try {
            const res = await loginUser(dto).unwrap()

            if(res) {
                dispatch(setUserData(res));
            }
            router.push('/')
        } catch (err: any) {
            console.log(err)
            setErrorMessage(err?.data?.message)
        }
    }

    const formControlLabelStyle = {
        "& .MuiFormControlLabel-label": {
          fontSize: "14px",
          width: 300,
          backgroundColor: 'rgba(0,0,0,0.1)',
          accentcolor: '#9b59b6'
        }
    }

    return (
        <FormProvider {...form}>
            <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ border: 1, borderColor: '#B885F4', borderRadius: '10px', p: 4, mt: 5}} bgcolor="#1A1E28">
                <h1 className={styles.loginTitle}>Join the Game, join the Chat!</h1>
                <Grid item xs={12} color="secondary">
                    <FormField  
                        label="Email"
                        name="email"
                        type="text"
                    />
                </Grid>
                <Grid item xs={12} color="secondary">
                    <FormField
                        name="password"
                        label="Password"
                        type="password"
                        
                    />
                </Grid>
                <Grid item xs={12}>
                    {error  && (
                        <Alert severity="error" className="mb-20">
                            {errorMessage}
                        </Alert>
                    )}
                </Grid>
                <FormControlLabel
                    sx={{ color: '#F3FB8C', ...formControlLabelStyle }}
                    control={<Checkbox value="remember" style ={{color: "#F3FB8C",}}/>}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    // disabled={!form.formState.isValid || form.formState.isSubmitting}
                    variant="contained"
                    sx={{mt: 3, mb: 2, color:'#000'}}
                    color="secondary"
                >
                    Sign In
                </Button>
                <Grid container className={styles.bottomLink} sx={{ mt: 2, mb: 1 }}>
                    <Grid item>
                        <Link href="/auth/register" className={styles.registerLink}>
                            {"Not a member? Register now"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </FormProvider>
    );
};

export default Form;