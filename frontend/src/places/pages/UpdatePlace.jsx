import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';
import { useHttp } from '../../shared/hooks/http-hook';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
	const placeId = useParams().placeId;
	const { isLoading, error, sendRequest, clearError } = useHttp();
	const [identifiedPlace, setIdentifiedPlace] = useState(null);
	const history = useHistory();
	const { userId } = useContext(AuthContext);

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: false
			},
			description: {
				value: '',
				isValid: false
			}
		},
		false
	);

	useEffect(() => {
		const findPlace = async () => {
			try {
				const data = await sendRequest(
					`http://localhost:5000/api/places/${placeId}`
				);
				setIdentifiedPlace(data.place);
				if (data.place) {
					setFormData(
						{
							title: {
								value: data.place.title,
								isValid: true
							},
							description: {
								value: data.place.description,
								isValid: true
							}
						},
						true
					);
				}
			} catch (error) {}
		};
		findPlace();
	}, [placeId, sendRequest]);

	const placeUpdateSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			await sendRequest(
				`http://localhost:5000/api/places/${placeId}`,
				'PATCH',
				JSON.stringify({
					title: formState.inputs.title.value,
					description: formState.inputs.description.value
				}),
				{ 'Content-Type': 'application/json' }
			);
			history.push('/' + userId + '/places');
		} catch (e) {}
	};

	if (!identifiedPlace) {
		return (
			<div className='center'>
				<Card>
					<h2>Could not find place!</h2>
				</Card>
			</div>
		);
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner />}
			{!isLoading && identifiedPlace && (
				<form className='place-form' onSubmit={placeUpdateSubmitHandler}>
					<Input
						id='title'
						element='input'
						type='text'
						label='Title'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid title.'
						onInput={inputHandler}
						initialValue={identifiedPlace.title}
						initialValid={true}
					/>
					<Input
						id='description'
						element='textarea'
						label='Description'
						validators={[VALIDATOR_MINLENGTH(5)]}
						errorText='Please enter a valid description (min. 5 characters).'
						onInput={inputHandler}
						initialValue={identifiedPlace.description}
						initialValid={true}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						UPDATE PLACE
					</Button>
				</form>
			)}
		</>
	);
};

export default UpdatePlace;
