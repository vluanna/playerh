import React from "react";
import { useState } from "react";
import { Show, SimpleShowLayout, TextField, useRecordContext, FunctionField, UrlField } from 'react-admin';
import { TextField as MuTextFiled } from '@material-ui/core';
import ReactPlayer from 'react-player'

export const PlayOverview = (props) => {

    const record = useRecordContext();

    console.log(record)

    const [password, setPassword] = useState('')

    return (
        <Show {...props} password={password}>
            <SimpleShowLayout>
                <TextField source="name" />
                {record?.pwd && (
                    <MuTextFiled label="Password" value={password} onChange={e => setPassword(e.target.value)} />
                )}
                {/* <UrlField label="URL" source="location" /> */}
                <FunctionField addLabel={false} render={record => !!record.location &&
                    <ReactPlayer
                        url={record.location}
                        controls={true}
                    />} />
            </SimpleShowLayout>
        </Show>
    )
};

export default PlayOverview