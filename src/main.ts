import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { emailAvailabilityMockInterceptor } from './email-availability.mock.interceptor';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-root',
  template: '<app-form />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ FormComponent ]
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([emailAvailabilityMockInterceptor])),
  ],
});
