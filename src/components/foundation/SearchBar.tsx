import { CheckCircle, Search } from "@mui/icons-material"
import { Chip, IconButton, Radio, RadioGroup, Stack, TextField } from "@mui/joy"
import React, { useState } from "react"
import Sticker, { ABC, Activities, Category, Environment, Places, Transport, Util } from "../TaskModal/Map/sticker"
import StickerDrawer from "../TaskModal/Map/StickerDrawer"

const SearchBar = function (props: SearchBarProps) {

    const [state, setState] = useState({ text: "", list: props.data })

    const [selected, setSelected] = React.useState(Category.Any.toString());

    let categoryList: Category[] = []
    Object.values(Category).forEach(s => {
        categoryList.push(s)
    });

    const searchList = function () {
        if (!state.text) props.setStickerList(props.data)
        setSelected(Category.Any.toString())
        props.setStickerList(props.data.filter((i) => i.toLowerCase().includes(state.text)))
    }

    const changeCategory = function (name: string, e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            setSelected(name)
            switch (name) {
                case Category.Transport:
                    props.setStickerList(Transport)
                    break;
                case Category.Util:
                    props.setStickerList(Util)
                    break;
                case Category.ABC:
                    props.setStickerList(ABC)
                    break;
                case Category.Activities:
                    props.setStickerList(Activities)
                    break;
                case Category.Environment:
                    props.setStickerList(Environment)
                    break;
                case Category.Logistics:
                    props.setStickerList(Environment)
                    break;
                case Category.Places:
                    props.setStickerList(Places)
                    break;
                case Category.Any:
                    props.setStickerList(props.data)
            }
        }
    }

    return (
        <>
            <Stack direction="row" spacing={1}>
                <TextField onChange={(e) => setState({ text: e.target.value, list: state.list })} fullWidth={true} />
                <IconButton type="submit" onClick={searchList}>
                    <Search />
                </IconButton>
            </Stack>
            <StickerDrawer
                stickers={props.stickerList}
                activeSticker={props.activeSticker}
                onStickerClick={props.onStickerClick}
            />
            <RadioGroup row sx={{ overflow: "scroll", gap: 1 }}>
                {categoryList.map(name => {
                    const checked = selected === name;
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
    data: Sticker[]
    activeSticker: Sticker
    onStickerClick: (index: Sticker) => void
    stickerList: Sticker[]
    setStickerList: React.Dispatch<React.SetStateAction<Sticker[]>>
}

export default SearchBar