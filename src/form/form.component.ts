import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import {
  debounce,
  email,
  form,
  FormField,
  required,
  validateAsync,
  validateHttp,
} from '@angular/forms/signals';

interface SignUpForm {
  username: string;
  email: string;
}

interface EmailCheckResponse {
  available: boolean;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
})
export class FormComponent {
  	protected model = signal<SignUpForm>({
		username: '',
		email: '',
	});

	protected form = form(this.model, s => {
		required(s.username, {message: 'A username is required'});
		required(s.email, {message: 'An email address is required'});
		email(s.email, {message: 'Please enter a valid email address'});

		validateAsync(s.username, {
			debounce: 2000,
			params: ctx => {
				const val = ctx.value();
				if (!val || val.length < 3) return undefined;
				return val;
			},
			factory: username =>
				resource({
					params: username,
					loader: async ({ params: username }) => {
						if (username === undefined) return undefined;
						const available = await this.checkUsernameAvailability(username);
						return available;
					},
				}),
			onSuccess: (result: boolean) => {
				if (!result) {
					return {
						kind: 'username_taken',
						message: 'This username is already taken',
					};
				}
				return null;
			},
			onError: (error: unknown) => {
				console.error('Validation error:', error);
				return null;
			},
		});
		// debounce(s.username, 2000);

		validateHttp(s.email, {
			debounce: 2000,
			request: ctx => this.emailAvailabilityUrl(ctx.value()),
			onSuccess: (result: EmailCheckResponse) => {
				if (!result.available) {
					return {
						kind: 'email_taken',
						message: 'This email is already registered',
					};
				}
				return null;
			},
			onError: (error: unknown) => {
				console.error('Email validation error:', error);
				return null;
			},
		});
		// debounce(s.email, 2000);
	});

	private checkUsernameAvailability(username: string): Promise<boolean> {
    return new Promise(resolve => {
        setTimeout(() => {
            const taken = ['test'];
            resolve(!taken.includes(username.toLowerCase()));
        }, 2500);
    });
	}

	private emailAvailabilityUrl(value: string | undefined): string | undefined {
		const email = value?.trim();
		if (!email || email.length < 5) {
			return undefined;
		}
		const query = new URLSearchParams({ email }).toString();
		return `/api/v1/signup/email-availability?${query}`;
	}
}
