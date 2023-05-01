import { useLocation } from 'react-router-dom';

const useTokenAndTokenId = function () {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    return { token, tokenId };
};

export default useTokenAndTokenId;
