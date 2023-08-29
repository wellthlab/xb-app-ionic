import { CheckCircle, Search } from "@mui/icons-material"
import { Chip, IconButton, Radio, RadioGroup, Stack, TextField } from "@mui/joy"
import React, { useEffect, useState } from "react"
import Sticker, { Activities, Category, Places, Transport, FacilitiesEnvironment, Navigation } from "./sticker"

type SearchBarProps = {
    stickerList: Sticker[]
    stickerResult: Sticker[]
    setStickerResult: React.Dispatch<React.SetStateAction<Sticker[]>>
    changeCategory: boolean
}

const StickerSearchBar = function (props: SearchBarProps) {

    const [state, setState] = useState({ text: "", list: props.stickerList, selectedCategory: Category.Any.toString() })

    let categoryList: Category[] = []
    Object.values(Category).forEach(s => {
        categoryList.push(s)
    });

    const searchList = function () {
        if (!state.text) props.setStickerResult(props.stickerList)
        setState({ text: state.text, list: state.list, selectedCategory: Category.Any.toString() })
        props.setStickerResult(props.stickerList.filter((i) => i.toLowerCase().includes(state.text)))
    }

    const handleTextChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setState({ text: e.target.value, list: state.list, selectedCategory: state.selectedCategory })
    }

    const changeCategory = function (name: Category, e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            setState({ text: "", list: state.list, selectedCategory: name })
            switch (name) {
                case Category.Transport:
                    props.setStickerResult(Transport)
                    break;
                case Category.Activities:
                    props.setStickerResult(Activities)
                    break;
                case Category.Places:
                    props.setStickerResult(Places)
                    break;
                case Category.FacilitiesEnvironment:
                    props.setStickerResult(FacilitiesEnvironment)
                    break;
                case Category.Navigation:
                    props.setStickerResult(Navigation)
                    break;
                case Category.Any:
                    props.setStickerResult(props.stickerList)
            }
        }
    }

    useEffect(() =>
        searchList(),
        [state.text]
    )

    return (
        <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
                <TextField value={state.text} onChange={(e) => handleTextChange(e)} fullWidth={true} placeholder="Enter a sticker..." />
                <IconButton children={<Search />} type="submit" onClick={searchList} />
            </Stack>
            {props.changeCategory ?
                <RadioGroup row sx={{ overflowX: "scroll", overflowY: 'hidden', gap: 1 }}>
                    {categoryList.map(name => {
                        const checked = state.selectedCategory === name;
                        return (
                            <Chip key={name} startDecorator={checked && <CheckCircle />} color={checked ? 'primary' : 'neutral'} variant="plain">
                                <Radio disableIcon overlay color={checked ? 'primary' : 'neutral'} label={name} key={name} onChange={(e) => changeCategory(name, e)} />
                            </Chip>
                        )
                    })}
                </RadioGroup> : <></>}
        </Stack>
    )
}

export default StickerSearchBar