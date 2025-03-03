import React from 'react';
import { Typography, Link, Divider, Stack } from '@mui/joy';

import {BaseModel} from '../models/utils'

const BuildInfo = function () {

        var o = BaseModel.isProd() ? 0.1 : 0.5;
        return <div style={{fontSize: "0.7em", marginTop: "3em", opacity: o, textAlign:  "center"}}>
            <p>{BaseModel.getBuildString()}</p>
        </div>
};

export default BuildInfo;
