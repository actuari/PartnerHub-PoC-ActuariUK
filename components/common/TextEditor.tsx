import React, { useEffect, useState } from 'react'
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false, loading: () => <LoaderCenter /> }
);
//import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import LoaderCenter from './LoaderCenter';

export default function ArticleEditor(props: { handleContent: (x: any) => void; value?: any }) {
    const [value, setValue] = useState(props.value);

    const editorSetter = (value: any) => value ? EditorState.createWithContent(convertFromRaw(value)) : EditorState.createEmpty()
    const [editorState, setEditorState] = useState(editorSetter(value))


    useEffect(() => {
        if (value !== props.value) {
            setValue(props.value);
            setEditorState(editorSetter(props.value))
        }
    }, [props.value, value])

    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);
        const newValue = convertToRaw(editorState.getCurrentContent());
        props.handleContent(
            newValue
        );
        setValue(newValue);
    };

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            editorStyle={{ fontFamily: 'Arial' }}
            toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: {
                    uploadCallback: uploadImageCallBack,
                    alt: { present: true, mandatory: true },
                },
                fontFamily: {
                    options: ["Arial", "Inter", "Montagu Slab"]
                }
            }}
            hashtag={{
                separator: ' ',
                trigger: '#',
            }}
        />
    )
}


function uploadImageCallBack(file: File) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', `Client-ID ${process.env.imgur_client_id!}`);
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                console.log(response)
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                console.log(error)
                reject(error);
            });
        }
    );
}