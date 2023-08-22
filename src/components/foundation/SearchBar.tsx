import { CheckCircle, Search } from "@mui/icons-material"
import { Chip, IconButton, Radio, RadioGroup, Stack, TextField } from "@mui/joy"
import React, { useState } from "react"
import Sticker, { Activities, Category, Places, Transport, FacilitiesEnvironment, Navigation} from "../TaskModal/Map/sticker"
import StickerDrawer from "../TaskModal/Map/StickerDrawer"

const SearchBar = function (props: SearchBarProps) {

    const [state, setState] = useState({ text: "", list: props.stickerList, selectedCategory: Category.Any.toString() })

    let categoryList: Category[] = []
    Object.values(Category).forEach(s => {
        categoryList.push(s)
    });

    const searchList = function () {
        if (!state.text) props.setStickerList(props.stickerList)
        setState({text: state.text, list: state.list, selectedCategory: Category.Any.toString()})
        props.setStickerList(props.stickerList.filter((i) => i.toLowerCase().includes(state.text)))
    }

    const changeCategory = function (name: string, e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            setState({text: "", list: state.list, selectedCategory: name})
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
        <>
            <Stack direction="row" spacing={1}>
                <TextField value ={state.text} onChange={(e) => setState({ text: e.target.value, list: state.list, selectedCategory: state.selectedCategory })} fullWidth={true} />
                <IconButton type="submit" onClick={searchList}>
                    <Search />
                </IconButton>
            </Stack>
            <StickerDrawer
                stickers={props.stickerResult}
                activeSticker={props.activeSticker}
                onStickerClick={props.onStickerClick}
            />
            <RadioGroup row sx={{ overflow: "scroll", gap: 1 }}>
                {categoryList.map(name => {
                    const checked = state.selectedCategory === name;
                    return (
                        <Chip key={name} startDecorator={checked && <CheckCircle />} color={checked ? 'primary' : 'neutral'} variant="plain">
                            <Radio disableIcon overlay color={checked ? 'primary' : 'neutral'} label={name} key={name} onChange={(e) => changeCategory(name, e)} />
                        </Chip>
                    )
                })}
            </RadioGroup>
        </>
    )
}

type SearchBarProps = {
    stickerList: Sticker[]
    activeSticker: Sticker
    onStickerClick: (index: Sticker) => void
    stickerResult: Sticker[]
    setStickerList: React.Dispatch<React.SetStateAction<Sticker[]>>
}

export default SearchBar