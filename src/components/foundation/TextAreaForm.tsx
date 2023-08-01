import { Typography } from '@mui/joy'
import React from 'react'
import Textarea from './Textarea'

function TextAreaForm(props: TextAreaFormProps) {

    const handleTextChange = function (e: React.ChangeEvent<HTMLTextAreaElement>) {
        props.setText(e.target.value)
    }
    
    return (
        <><Typography level="body2">{props.label}
        </Typography>
            <Textarea
                placeholder=""
                value={props.text}
                minRows={5}
                maxRows={3}
                onChange={handleTextChange}
            /></>
    )
}

type TextAreaFormProps = {
    label: string,
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>
}

export default TextAreaForm
