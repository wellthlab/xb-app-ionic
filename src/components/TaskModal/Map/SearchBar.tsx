import { CheckCircle, Search } from "@mui/icons-material"
import { Chip, IconButton, Radio, RadioGroup, Stack, TextField } from "@mui/joy"
import React, { useEffect, useState } from "react"
import Sticker, { Activities, Category, Places, Transport, FacilitiesEnvironment, Navigation } from "./sticker"

const SearchBar = function (props: SearchBarProps) {

    const [state, setState] = useState({ text: "", list: props.stickerList, selectedCategory: Category.Any.toString() })

    let categoryList: Category[] = []
    Object.values(Category).forEach(s => {
        categoryList.push(s)
    });

    const searchList = function () {
        if (!state.text) props.setStickerList(props.stickerList)
        setState({ text: state.text, list: state.list, selectedCategory: Category.Any.toString() })
        props.setStickerList(props.stickerList.filter((i) => i.toLowerCase().includes(state.text)))
    }

    const handleTextChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        setState({ text: e.target.value, list: state.list, selectedCategory: state.selectedCategory })
    }

    useEffect(() =>
        searchList(),
        [state.text])

    const changeCategory = function (name: string, e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            setState({ text: "", list: state.list, selectedCategory: name })
            switch (name) {
                case Category.Transport:
                    props.setStickerList(Transport)
                    break;
                case Category.Activities:
                    props.setStickerList(Activities)
                    break;
                case Category.Places:
                    props.setStickerList(Places)
                    break;
                case Category.FacilitiesEnvironment:
                    props.setStickerList(FacilitiesEnvironment)
                    break;
                case Category.Navigation:
                    props.setStickerList(Navigation)
                    break;
                case Category.Any:
                    props.setStickerList(props.stickerList)
            }
        }
    }

    return (
        <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
                <TextField value={state.text} onChange={(e) => handleTextChange(e)} fullWidth={true} placeholder="Enter a sticker..." />
                <IconButton type="submit" onClick={searchList}>
                    <Search />
                </IconButton>
            </Stack>
            {props.changeCategory ? <RadioGroup row sx={{ overflowX: "scroll", overflowY: 'hidden', gap: 1 }}>
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

type SearchBarProps = {
    stickerList: Sticker[]
    stickerResult: Sticker[]
    setStickerList: React.Dispatch<React.SetStateAction<Sticker[]>>
    changeCategory: boolean
}

export default SearchBar