import React from 'react';
import { useSelector, useDispatch } from '../slices/store';
import { selectStudy, loadStudy } from '../slices/study';

const useStudy = function () {
    const study = useSelector(selectStudy);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (study) {
            return;
        }

        const getStudy = async function () {
            await dispatch(loadStudy()).unwrap();
        };

        getStudy();
    }, []);

    return { study, isPending: !study };
};

export default useStudy;
