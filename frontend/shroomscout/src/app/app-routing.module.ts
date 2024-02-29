import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveFeedComponent } from './live-feed/live-feed.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: LiveFeedComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
