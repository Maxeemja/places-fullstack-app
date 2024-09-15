import { useCallback, useEffect, useState } from 'react';

let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(false);
	const [tokenExpDate, setTokenExpDate] = useState();
	const [userId, setUserId] = useState(null);

	const login = useCallback((userId, token, expirationDate) => {
		setToken(token);
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpDate(tokenExpirationDate);
		setUserId(userId);
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId,
				token,
				expiration: tokenExpirationDate.toISOString()
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUserId(null);
		setTokenExpDate(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpDate) {
			const remainingTime = tokenExpDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpDate]);

	useEffect(() => {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (
			userData &&
			userData.token &&
			new Date(userData.expiration) > new Date()
		) {
			login(userData.userId, userData.token, new Date(userData.expiration));
		}
	}, [login]);

	return { login, logout, token, userId };
};
