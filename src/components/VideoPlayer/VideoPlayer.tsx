// @ts-nocheck
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Error, DataProviderContext } from 'react-admin';
import ReactPlayer from 'react-player'
import { get, compact } from 'lodash'
import { DEFAULT_LANGUAGE } from "../../constants/Defined";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CircularProgress from '@material-ui/core/CircularProgress';
import './VideoPlayer.scss';

const VideoPlayer = ({ record, password, subtitles = [], light = false, width, height, ...props }) => {

    const dataProvider = useContext(DataProviderContext);
    const [data, setData] = useState({})
    const [playing, setPlaying] = useState(false)
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();

    const isDefaultSub = (sub) => {
        return get(sub, 'attributes.language') === DEFAULT_LANGUAGE
    }

    const tracks = useMemo(() => compact(subtitles).map(sub => ({
        kind: 'subtitles', src: sub?.src || sub?.link, srcLang: get(sub, 'attributes.language'), default: isDefaultSub(sub)
    })), [subtitles])

    useEffect(() => {
        if (record?.linkcode) {
            setIsFetching(true)
            dataProvider.getOne('download', record)
                .then(({ data }) => {
                    setData(data);
                })
                .catch(error => {
                    console.log(error);
                    setError(error)
                })
                .finally(() => setIsFetching(false))
        }
    }, [record, password, dataProvider])

    useEffect(() => {
        setIsFetching(true)
        setTimeout(() => setIsFetching(false), 500)
    }, [tracks, data])

    if (error) return <Error />;

    // console.log('tracks', tracks, subtitles)

    return (
        <div style={{ width, height, minHeight: '50vh', position: 'relative' }}>
            {!isFetching && (
                <ReactPlayer
                    {...props}
                    width={width}
                    height={height}
                    playing={playing}
                    light={light}
                    url={data.location}
                    controls={playing}
                    config={{
                        file: { tracks }
                    }}
                />
            )}
            {(!playing || isFetching) && (
                <div
                    onClick={() => setPlaying(true)}
                    style={{
                        top: 0, left: 0,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: 'rgba(0,0,0,0.7)',
                    }}>
                    {isFetching ? (
                        <CircularProgress color="white" />
                    ) : <PlayArrowIcon color="white" fontSize="large" />}
                </div>
            )}
        </div>
    )
}

export default VideoPlayer