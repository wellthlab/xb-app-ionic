import { ListItem, Checkbox, List, FormControlProps } from "@mui/joy"
import React from "react"

const MultipleSelect = function (props: MultipleSelectProps) {

    let group = props.value

    const handleCheckboxChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        if (e.target.checked) {
            group = group + " " + value
        } else {
            group = group.replace(value, "")
        }
        props.onChange(group)
    }

    return (
        <List sx={{"backgroundColor": "white"}}>
            <ListItem>
            <p>{props.label}</p>
            </ListItem>
            {props.options.map((i) =>
                <ListItem>
                    <Checkbox onChange={(e) => handleCheckboxChange(e)} value={i} label={i} key={i} />
                </ListItem>)}
        </List>)
}

export interface MultipleSelectProps extends Omit<FormControlProps, 'onChange'> {
    options: string[],
    label: string,
    value: string,
    onChange: (group: string) => void
}

export default MultipleSelect