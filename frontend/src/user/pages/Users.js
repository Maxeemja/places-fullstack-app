import React, {useEffect, useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message)
                }
                setUsers(data.users)
            } catch (e) {
                setError(e.message || 'Something went wrong :(');
            }
            setIsLoading(false)
        }
        sendRequest()
    }, []);

    const errorHandler = () => {
        setError(null)
    }

    return (
        <>
            <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
            {isLoading && <div className='center'>
                <LoadingSpinner/>
            </div>}
            {!isLoading && users && <UsersList items={users}/>}
        </>
    )

};

export default Users;
 