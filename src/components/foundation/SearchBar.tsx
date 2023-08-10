import { Search } from "@mui/icons-material"
import { IconButton, Stack, TextField } from "@mui/joy"
import React, { ReactNode, useState } from "react"
import Sticker from "../TaskModal/Map/sticker"
import StickerDrawer from "../TaskModal/Map/StickerDrawer"

const SearchBar = function (props: SearchBarProps) {

    const [state, setState] = useState({ text: "", list: props.data })

    const searchList = function () {
        if (!state.text) props.setStickerList(props.data)
        props.setStickerList(props.data.filter((i) => i.getLabel().toLowerCase().includes(state.text)))
    }

    return (
        <>
            <Stack direction="row">
                <TextField onChange={(e) => setState({ text: e.target.value, list: state.list })} />
                <IconButton type="submit" onClick={searchList}>
                    <Search />
                </IconButton>
            </Stack>
            <StickerDrawer
                stickers={props.stickerList}
                activeSticker={props.activeSticker}
                onStickerClick={props.onStickerClick}
            />
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