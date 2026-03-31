import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { form, Field, required, email, customError, validateAsync, debounce } from '@angular/forms/signals';

interface SignUpForm {
  username: string;
  email: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Field],
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

		debounce(s.username, 500);

		validateAsync(s.username, {
			params: ({ value }) => {
					const val = value();
					if (!val || val.length < 3) return undefined;
					return val;
			},
			factory: username =>
					resource({
							params: username,
							loader: async ({ params: username }) => {
									const available = await this.checkUsernameAvailability(username);
									return available;
							}
					}),
			onSuccess: (result: boolean) => {
				if (!result) {
						return customError({
								kind: 'username_taken',
								message: 'This username is already taken',
						});
				}
				return null;
			},
			onError: (error: unknown) => {
					console.error('Validation error:', error);
					return null;
			}
		});
	});

	private checkUsernameAvailability(username: string): Promise<boolean> {
    return new Promise(resolve => {
        setTimeout(() => {
            const taken = ['admin', 'test', 'brian'];
            resolve(!taken.includes(username.toLowerCase()));
        }, 2500);
    });
	}
}
