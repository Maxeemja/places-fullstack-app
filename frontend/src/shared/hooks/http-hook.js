import {useCallback, useEffect, useRef, useState} from "react";

export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const activeHttpRequests = useRef([])


    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            setIsLoading(true);
            const abortController = new AbortController();
            activeHttpRequests.current.push(abortController)

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: abortController.signal,
                });
                const data = await response.json();

                activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== abortController);
                
                if (!response.ok) {
                    throw new Error(data.message)
                }
                setIsLoading(false)
                return data;
            } catch (e) {
                setError(e.message || 'Something went wrong :(');
                setIsLoading(false)
                throw e;
            }
        }, [])

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, []);

    return {isLoading, error, sendRequest, clearError}
}