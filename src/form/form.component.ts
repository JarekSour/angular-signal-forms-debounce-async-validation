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
		email: '',
	});

	protected form = form(this.model, s => {
		required(s.email, {message: 'An email address is required'});
		email(s.email, {message: 'Please enter a valid email address'});
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
	});

	private emailAvailabilityUrl(value: string | undefined): string | undefined {
		const email = value?.trim();
		if (!email || email.length < 5) {
			return undefined;
		}
		const query = new URLSearchParams({ email }).toString();
		return `/api/v1/signup/email-availability?${query}`;
	}

	onSubmit(e:Event){
		e.preventDefault()

		console.log(this.model())
	}
}
