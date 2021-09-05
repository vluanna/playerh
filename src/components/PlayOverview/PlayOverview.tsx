// @ts-nocheck
import React, { useState, useCallback } from "react";
import { Show, SimpleShowLayout, TextField, FunctionField, UrlField } from 'react-admin';
import { TextField as MuTextField } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SubtitleSearch from "../SubtitleSearch";
import { useMemo } from "react";
import VideoPlayer from "../VideoPlayer";


export const PlayOverview = (props) => {


    const [showSubtitles, setShowSubtitle] = useState(false)
    const [subtitles, setSubtitles] = useState([])

    const [password, setPassword] = useState('')

    const onSelectSub = useCallback((subData) => {
        console.log('onSelectSub', subData)
        setSubtitles([...subtitles, subData])
    }, [subtitles])

    const subTitleAside = useMemo(() => {
        return showSubtitles ? <SubtitleSearch selections={subtitles} onSelect={onSelectSub} /> : null
    }, [showSubtitles, subtitles, onSelectSub])

    return (
        <Show {...props} aside={subTitleAside}>
            <SimpleShowLayout>
                <TextField source="name" />
                <MuTextField label="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <span><Switch
                    checked={showSubtitles}
                    onChange={e => setShowSubtitle(e.target.checked)}
                    name="checkedB"
                    color="primary"
                /> Subtitles</span>
                <UrlField label="URL" source="location" />
                <FunctionField addLabel={false} render={record => (
                    <VideoPlayer record={record} password={password} subtitles={subtitles} />
                )} />
            </SimpleShowLayout>
        </Show>
    )
};

export default PlayOverview