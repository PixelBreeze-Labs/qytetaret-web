import { useState } from "react";
import { useTranslations } from 'next-intl';
import FormButton from "../Common/Dashboard/FormButton";
import InputGroup from "../Common/Dashboard/InputGroup";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import validateEmail from "@/libs/validateEmail";
import Loader from "../Common/Loader";
import { integrations, messages } from "../../../integrations.config";

export default function SigninWithMagicLink() {
	const t = useTranslations('auth.magicLink');
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (!integrations.isAuthEnabled) {
			setLoading(false);
			return toast.error(messages.auth);
		}

		if (!email) {
			return toast.error(t('errors.emailRequired'));
		}

		if (!validateEmail(email)) {
			setLoading(false);
			return toast.error(t('errors.emailInvalid'));
		} else {
			signIn("email", {
				redirect: false,
				email,
			})
				.then((callback) => {
					if (callback?.ok) {
						toast.success(t('success'));
						setEmail("");
						setLoading(false);
					}
				})
				.catch((error) => {
					toast.error(error);
					setLoading(false);
				});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className='mb-5 space-y-4'>
				<InputGroup
					label={t('email.label')}
					placeholder={t('email.placeholder')}
					type='email'
					name='email'
					required
					height='50px'
					value={email}
					handleChange={handleChange}
				/>

				<FormButton height='50px'>
					{loading ? (
						<>
							{t('sending')} <Loader style='border-white dark:border-dark' />
						</>
					) : (
						t('submit')
					)}
				</FormButton>
			</div>
		</form>
	);
}