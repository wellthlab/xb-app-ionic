import React, { Suspense, lazy } from "react";
import LineEditor from "./LineEditor";
const Map = lazy(() => import("./Map"))

function Journey() {
    return (<Suspense fallback={<div>Loading...</div>}>
        <Map children={<LineEditor />} />
    </Suspense>)
}

export default Journey;