// @ts-nocheck
import React, { useState, useCallback } from "react";
import { Show, SimpleShowLayout, TextField, FunctionField } from 'react-admin';
import { TextField as MuTextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import SubtitleSearch from "../SubtitleSearch";
import { useMemo } from "react";
import VideoPlayer from "../VideoPlayer";
// import axios from 'axios'
import VTTConverter from 'srt-webvtt';
import SearchIcon from '@material-ui/icons/Search';

export const PlayOverview = (props) => {


    const [showSubtitles, setShowSubtitle] = useState(false)
    const [subtitles, setSubtitles] = useState([])

    const [password, setPassword] = useState('')

    const loadSubTrack = (subData, callback) => {
        console.log('LOAD SUB:', subData)
        const vttConverter = new VTTConverter(subData.blob)
        vttConverter
            .getURL()
            .then(function (url) { // Its a valid url that can be used further
                sub.src = url;
                callback(sub)
            })
            .catch(function (err) {
                console.error(err);
                callback()
            })
    }

    const onSelectSub = useCallback((subData) => {
        loadSubTrack(subData, (track) => {
            console.log('onSelectSub', track)
            setSubtitles([...subtitles, track])
            setShowSubtitle(false)
        })
    }, [subtitles])

    const subTitleAside = useMemo(() => {
        return showSubtitles ? (
            <Modal
                open={showSubtitles}
                onClose={() => setShowSubtitle(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={{ top: '50vh', left: '50vw', transform: `translate(-50%, -50%)`, position: 'fixed', background: '#444', borderRadius: 5 }}>
                    <SubtitleSearch selections={subtitles} onSelect={onSelectSub} />
                </div>
            </Modal>

        ) : null
    }, [showSubtitles, subtitles, onSelectSub])

    return (
        <Show {...props}>
            <SimpleShowLayout>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                    <TextField addLabel={false} source="name" />
                    <MuTextField label="Password" value={password} onChange={e => setPassword(e.target.value)} variant="outlined" size="small" />
                    <Button variant="outlined" onClick={e => setShowSubtitle(true)} startIcon={<SearchIcon />}>Subtitles</Button>
                </div>

                <FunctionField addLabel={false} render={record => (
                    <VideoPlayer record={record} password={password} subtitles={subtitles} width="100%" height="75vh" />
                )} />
                <FunctionField addLabel={false} render={record => subTitleAside} />
            </SimpleShowLayout>
        </Show>
    )
};

export default PlayOverview