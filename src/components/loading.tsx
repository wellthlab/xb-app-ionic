import { CircularProgress, styled } from '@mui/joy';

export type LoadingProps = {};

const StyledDiv = styled('div')({
    height: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

export function Loading(props: LoadingProps) {
    return (
        <StyledDiv>
            <CircularProgress size="sm" />
        </StyledDiv>
    );
}
