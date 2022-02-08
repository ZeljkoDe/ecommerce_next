import { createContext, useState, useEffect } from 'react';
import { useRouter, userRouter } from 'next/router';
import { Magic } from 'magic-sdk';
import { MAGIC_PUBLIC_KEY } from '../utils/url';

const AuthContext = createContext();
let magic;

export const AuthProvider = (props) => {
	const [user, setUser] = useState(null);
	const router = useRouter();

	/**
	 * Adds email to user
	 * @param {string} email 
	 */
	const loginUser = async (email) => {
		try {
			await magic.auth.loginWithMagicLink({ email });
			setUser({ email });
			router.push('/');
		} catch (err) {
			setUser(null);
		}
	};

	/**
	 * Sets user to null
	 */
	const logoutUser = async () => {
		try {
			await magic.user.logout();
			setUser(null);
			router.push('/');
		} catch (err) {

		}
	};

	const checkUserLoggedIn = async () => {
		try {
			const isLoggedIn = await magic.user.isLoggedIn();
			if (isLoggedIn) {
				const { email } = await magic.user.getMetadata();
				setUser({ email });
			}
		} catch (err) {

		}
	};

	useEffect(() => {
		magic = new Magic(MAGIC_PUBLIC_KEY);
		checkUserLoggedIn();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loginUser, logoutUser }}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;