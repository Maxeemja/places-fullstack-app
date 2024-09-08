import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const UserPlaces = () => {
	const { isLoading, sendRequest, error, clearError } = useHttp();
	const [places, setPlaces] = useState([]);
	const userId = useParams().userId;
	const history = useHistory();

	useEffect(() => {
		const getPlaces = async () => {
			try {
				const data = await sendRequest(
					`http://localhost:5000/api/places/user/${userId}`
				);
				setPlaces(data.places);
			} catch (error) {}
		};
		getPlaces();
	}, [sendRequest, userId]);

	const onClear = () => {
		clearError();
		history.push('/');
	};

	return (
		<>
			<ErrorModal error={error} onClear={onClear} />
			{isLoading && <LoadingSpinner />}
			{!isLoading && !!places.length && <PlaceList items={places} />}
		</>
	);
};

export default UserPlaces;
