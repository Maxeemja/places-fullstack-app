import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
	const { token } = useContext(AuthContext);
	const { isLoading, sendRequest, error, clearError } = useHttp();
	const [places, setPlaces] = useState([]);
	const userId = useParams().userId;
	const history = useHistory();

	useEffect(() => {
		const getPlaces = async () => {
			try {
				const data = await sendRequest(
					`http://localhost:5000/api/places/user/${userId}`,
					'GET',
					null,
					{ Authorization: 'Bearer ' + token }
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

	const placeDeletedHandler = (deletedPlaceId) => {
		setPlaces((places) =>
			places.filter((place) => place.id !== deletedPlaceId)
		);
	};

	return (
		<>
			<ErrorModal error={error} onClear={onClear} />
			{isLoading && <LoadingSpinner />}
			{!isLoading && !!places.length && (
				<PlaceList items={places} onDeletePlace={placeDeletedHandler} />
			)}
		</>
	);
};

export default UserPlaces;
