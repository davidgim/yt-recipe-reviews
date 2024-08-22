import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRefreshMutation } from '../features/auth/authApiSlice'
import { selectCurrentToken } from '../features/auth/authSlice'
import usePersist from '../hooks/usePersist'
import { Outlet } from 'react-router-dom'

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector(selectCurrentToken);
    const [refresh] = useRefreshMutation();
    const [persist] = usePersist();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh().unwrap();
            } catch (err) {
                console.error("Failed to refresh token", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (!token && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }
    }, [token, refresh, persist])

    if (isLoading) {
        return <p>Loading...</p>
    }

    return <Outlet />
}

export default PersistLogin