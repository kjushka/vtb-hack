import { useState, useEffect } from 'react';

const useImageError = () => {
    const [el, setEl] = useState(null);
    const [error, setError] = useState(false);
    const [load, setLoad] = useState(false);

    const _handleError = () => { setError(true) };
    const _handerLoad = () => { setLoad(true) };
    const retry = () => { setError(false) };

    useEffect(() => {
        el?.addEventListener('error', _handleError);
        el?.addEventListener('load', _handerLoad);

        return () => {
            el?.removeEventListener('error', _handleError);
            el?.removeEventListener('load', _handleError)
        }
    }, [el]);

    return [setEl, load, error, retry, el];
};

export { useImageError };