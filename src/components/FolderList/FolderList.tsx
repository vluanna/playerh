// @ts-nocheck
import React from 'react';
import fileSize from 'filesize';
import { Datagrid, TextField, List, FunctionField, useResourceContext, ShowButton } from 'react-admin';
import { FileCopy, Folder } from '@material-ui/icons';
import { FILE_TYPE } from '../../constants/Defined';

const FolderList = ({ name, ...props }) => {
    const { resource } = useResourceContext()
    return (
        <List {...props} title={name || resource}>
            <>
                <Datagrid>
                    <FunctionField render={record => record.type === FILE_TYPE.FOLDER.id ? <Folder /> : <FileCopy />} textAlign="right" />
                    <TextField source="name" />
                    <FunctionField
                        label="Size"
                        render={record => !!record.size && record.type !== FILE_TYPE.FOLDER.id ? fileSize(Number(record.size)) : ''}
                        textAlign="right"
                    />
                    <TextField source="description" />
                    <TextField source="folder_path" />
                    <ShowButton record={Object.assign(props.record || {}, { id: props.record?.linkcode })} />
                </Datagrid>
            </>
        </List>
    )
}

export default FolderList