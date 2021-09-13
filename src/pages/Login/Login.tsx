import React from 'react'
import { Login as RaLogin, useLogin, useNotify, useSafeSetState, useTranslate } from 'react-admin';
import { LOCAL_STORAGE_KEY } from '../../constants/Defined';
import LocalStorage from '../../utils/localStorage';
import { Field, Form } from 'react-final-form';
import {
    Button,
    CardActions,
    CircularProgress,
    TextField,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useState } from 'react';

const useStyles = makeStyles(
    (theme: Theme) => ({
        form: {
            padding: '0 1em 1em 1em',
        },
        input: {
            marginTop: '1em',
        },
        button: {
            width: '100%',
        },
        icon: {
            marginRight: theme.spacing(1),
        },
        username: {
            textAlign: 'center',
        },
        link: {
            textAlign: 'center',
            width: '100%',
            marginTop: 20,
        },
        linkButton: {
            color: 'white',
            cursor: 'pointer',
        }
    }),
    { name: 'RaLoginForm' }
);

const Input = ({
    meta: { touched, error }, // eslint-disable-line react/prop-types
    input: inputProps, // eslint-disable-line react/prop-types
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);


const Login = (props): JSX.Element => {

    const [username, setUsername] = useState(LocalStorage.get(LOCAL_STORAGE_KEY.AUTH_USERNAME));
    const bgImageUrl = 'https://www.fshare.vn/images/page-home/background-0.jpg'

    const { redirectTo } = props;
    const [loading, setLoading] = useSafeSetState(false);
    const login = useLogin();
    const translate = useTranslate();
    const notify = useNotify();
    const classes = useStyles(props);

    const resetUserName = () => {
        setUsername('');
        LocalStorage.set(LOCAL_STORAGE_KEY.AUTH_USERNAME, null)
    }

    const validate = (values) => {
        return { password: values.password ? undefined : translate('ra.validation.required') };
    };

    const submit = values => {
        setLoading(true);
        login({ ...values, username }, redirectTo)
            .then(() => {
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                            ? 'ra.auth.sign_in_error'
                            : error.message,
                    'warning',
                    {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                    ? error.message
                                    : undefined,
                    }
                );
            });
    };

    return !username ? (
        <RaLogin
            backgroundImage={bgImageUrl}
            {...props}
        />
    ) : (
        <RaLogin
            backgroundImage={bgImageUrl}
            {...props}
        >
            <Form
                onSubmit={submit}
                validate={validate}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={classes.form}>
                            <div>
                                <div className={classes.username}>
                                    {username}
                                </div>

                            </div>
                            <div className={classes.input}>
                                <Field
                                    id="password"
                                    name="password"
                                    component={Input}
                                    label={translate('ra.auth.password')}
                                    type="password"
                                    disabled={loading}
                                    autoFocus
                                    autoComplete="current-password"
                                />
                            </div>
                            <div className={classes.link}>
                                <Button className={classes.button} onClick={() => resetUserName()}>
                                    {'Use another username'}
                                </Button>
                            </div>
                        </div>
                        <CardActions>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                className={classes.button}
                            >
                                {loading && (
                                    <CircularProgress
                                        className={classes.icon}
                                        size={18}
                                        thickness={2}
                                    />
                                )}
                                {translate('ra.auth.sign_in')}
                            </Button>

                        </CardActions>
                    </form>
                )}
            />
        </RaLogin>
    )
}

export default Login