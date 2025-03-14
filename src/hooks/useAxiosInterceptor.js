import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const useAxiosInterceptor = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, [getToken]);
};

export default useAxiosInterceptor;
