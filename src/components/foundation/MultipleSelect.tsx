import { ListItem, Checkbox, List } from "@mui/joy"
import React, { useState } from "react"

const MultipleSelect = function(props: MultipleSelectProps) {

    const [group, setGroup] = useState<string[]>([])

    const handleCheckboxChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        const checked = e.target.checked
        if (checked) {
            setGroup(group.concat([value]))
        } else {
            setGroup(group.filter(v => v != value))
        }
    }
    return (
    <List>
        {props.options.map((i) => <ListItem>
        <Checkbox onChange={(e) =>handleCheckboxChange(e)} label={i} key={i}/>
      </ListItem>)}
    </List>)
}

export interface MultipleSelectProps {
    options: string[]
}

export default MultipleSelect