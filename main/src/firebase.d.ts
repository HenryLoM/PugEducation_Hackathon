declare module "../src/firebase" {
	import { Auth, GoogleAuthProvider } from "firebase/auth";
	export const auth: Auth;
	export const googleProvider: GoogleAuthProvider;
}
