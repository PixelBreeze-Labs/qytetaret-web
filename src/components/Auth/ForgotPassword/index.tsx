"use client";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import axios from "axios";
import Loader from "@/components/Common/Loader";
import validateEmail from "@/libs/validateEmail";
import { integrations, messages } from "../../../../integrations.config";

export default function ForgotPassword() {
	const t = useTranslations('auth.forgotPassword');
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!integrations.isAuthEnabled) {
			return toast.error(messages.auth);
		}

		if (!email) {
			toast.error(t('errors.emailRequired'));
			return;
		}

		if (!validateEmail(email)) {
			toast.error(t('errors.emailInvalid'));
			return;
		}

		try {
			setLoading(true);
			const res = await axios.post("/api/forgot-password/reset", {
				email,
			});

			if (res.status === 404) {
				toast.error(t('errors.userNotFound'));
				setEmail("");
				setLoading(false);
				return;
			}

			if (res.status === 200) {
				toast.success(res.data);
				setLoading(false);
				setEmail("");
			}
		} catch (error: any) {
			setLoading(false);
			toast.error(error.response.data);
		}
	};

	return (
		<div className='mx-auto w-full max-w-[400px] py-10'>
			<div className='mb-7.5 text-center'>
				<h3 className='mb-4 font-satoshi text-heading-5 font-bold text-dark dark:text-white'>
					{t('title')}
				</h3>
				<p className='text-base dark:text-gray-5'>
					{t('description')}
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className='mb-5 space-y-4.5'>
					<InputGroup
						label={t('email.label')}
						placeholder={t('email.placeholder')}
						type='email'
						name='email'
						height='50px'
						handleChange={handleChange}
						value={email}
					/>

					<FormButton height='50px'>
						{loading ? (
							<>
								{t('sending')}
								<Loader style='border-white dark:border-dark' />
							</>
						) : (
							t('submit')
						)}
					</FormButton>
				</div>

				<p className='text-center font-satoshi text-base font-medium text-dark dark:text-white'>
					{t('hasAccount')}{" "}
					<Link
						href='/auth/signin'
						className='ml-1 inline-block text-primary'
					>
						{t('signIn')}
					</Link>
				</p>
			</form>
		</div>
	);
}